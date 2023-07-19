const VendorDetailModel = require("../models/vendorDetailModel");
const { getVendorDetail, count } = require("../services/vendorDetail.service");
const VendorModel = require("../models/vendorModel");
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

async function findAllDetail(req, res, next) {
    try {
          if(!req){
            return res.status(404).json({
              message: "req.body is missing",
            });
          }
        const findAllData = await getVendorDetail(req)
        const dataCount = await count()
        res.status(200).json({
            message: "Get All Data Successfully!",
            data: findAllData,
            totalCount: dataCount,
            rowCount: findAllData.length
        })
    } catch (error) {
        // next(error)
        console.log("error in findAllDetail in vendorDetailController",error);
    }
}

async function createDetail(req, res) {
    try{
          if(!req.body){
            return res.status(404).json({
              message: "req.body is missing",
            });
          }
        const newData = req.body
        // var create_index = await VendorDetailModel.createIndexes({ vendor_id: 1 }, { unique: true });

        await VendorDetailModel.create(newData)
            .then(async (createdTask) => {
                if (!createdTask)
                    return res.status(404).json({
                        message: "Task creation failed",
                    });
                res.status(201).json({
                    message: "Detail add successfully!",
                    data: createdTask,
                });
            })
            .catch((error) => {
                res.status(404).json({
                    error: error.message,
                });
            })
    }catch(error){
        console.log("error in createDetail in vendorDetailController",error);
    }
}

async function scrapping_createDetail(req, res) {
    try{
          if(!req.body){
            return res.status(404).json({
              message: "req.body is missing",
            });
          }
        var url_arr = [];
        var ids_arr = [];
        var getalllink = await VendorModel.find({});
        if(getalllink){
            for (let g = 0; g < Math.min(getalllink.length, 5); g++) {
                // for (let g = 0; g < getalllink.length; g++) {
                url_arr.push({url:getalllink[g].profileLink,idds:getalllink[g]._id});
            }
        }
        console.log("url_arr", url_arr);
     
        if(url_arr){
            try {
                const username = 'ceo@amrytt.com';
                const password = 'Jhd@27489107';
                const proxyServer = 'your_proxy_ip:your_proxy_port';
                const browser = await puppeteer.launch({
                  headless: false,
                  args: [
                    `--proxy-server=${proxyServer}`,
                    '--disable-web-security', // Add any other arguments you need
                  ],
                });
                // const browser = await puppeteer.launch({ headless: false, args: ['--disable-web-security'] });
                const page = await browser.newPage();
            
                // Set a longer timeout for navigation
                page.setDefaultNavigationTimeout(60000); // Set timeout to 60 seconds
            
                // Navigate to the login page
                await page.goto('https://cp.adsy.com/marketer/platform/publisher-page/77719', { waitUntil: 'networkidle0' });
            
                // Fill in the login form
                await page.waitForSelector('input[name="LoginForm[email]"]', { visible: true });
                await page.type('input[name="LoginForm[email]"]', username);
                await page.type('input[name="LoginForm[password]"]', password);
            
                // Submit the login form
                await Promise.all([
                  page.waitForNavigation({ waitUntil: 'networkidle0' }),
                  page.evaluate(() => document.querySelector('form').submit())
                ]);
            
                // Wait for the main content to load
                await page.waitForSelector('main.main');
            
                // Define a list of URLs to extract data from
                // const urls = [
                //   'https://cp.adsy.com/marketer/platform/publisher-page/77719',
                //   'https://cp.adsy.com/marketer/platform/publisher-page/65159',
                //   'https://cp.adsy.com/marketer/platform/publisher-page/103260',
                //   'https://cp.adsy.com/marketer/platform/publisher-page/49593',
                //   'https://cp.adsy.com/marketer/platform/publisher-page/39537',
                // ];

                const urls = url_arr;
            
                // Iterate over the URLs and extract data from each page
                // for (const url of urls) {
                for (const { url, idds } of urls) {

                    // return false
                    
                  await page.goto(url, { waitUntil: 'networkidle0' });
            
                  // Extract the desired data from the page
                  const pageContent = await page.content();
            
                  // Use cheerio to parse the HTML
                  const $ = cheerio.load(pageContent);
            
                  // Extract the specific data fields using cheerio selectors
                  const text = $('strong').text();
                  const values = text.match(/(\d+)\.?(\d+)?%/);
            
                  const rating_arr = [];
                  const articles = $('div#w0 article');
            
                  if ($('div#w0 ul').length > 0) {
                    console.log("Check pagination");
                    // If pagination exists, extract the URLs and retrieve article data from each page
                    // const paginationUrls = $('div#w0 ul li a[data-page]');
                    const paginationUrls = $('div#w0 ul li:not(.table__next-page) a[data-page]');
            
                    // console.log("paginationUrls", paginationUrls);
            
                    for (let i = 0; i < paginationUrls.length; i++) {
                      const element = paginationUrls[i];
                      const url = $(element).attr('href');
                      const url_update = "https://cp.adsy.com" + url;
                      console.log("url_update====>>>", url_update);
            
                      console.log("call getpagedata");
                      await page.goto(url_update, { waitUntil: 'networkidle0' });
            
                      // Extract the desired data from the page
                      const pageContent = await page.content();
            
                      // Use cheerio to parse the HTML
                      const $$ = cheerio.load(pageContent);
                      const pageData = $$('div#w0 article');
            
                      // Process and push the article data to the rating_arr
                      pageData.each((index, element) => {
                        const article = $$(element);
                        const name = article.find('header.media--common__header h3').text();
                        const postedTime = article.find('header.media--common__header time').text();
                        const postedDate = article.find('header.media--common__header time').attr('datetime');
                        const rating = article.find('header.media--common__header data').attr('value');
                        const caption = article.find('header.media--common__header figcaption').text();
                        const body = article.find('div.media--common__body').text().trim();
            
                        rating_arr.push({ name: name, postedTime: postedTime, postedDate: postedDate, rating: rating, caption: caption, body: body });
                      });
                    }
                  } else {
                    console.log("No pagination");
                    // If no pagination, extract the article data directly
                    articles.each((index, element) => {
                      const article = $(element);
                      const name = article.find('header.media--common__header h3').text();
                      const postedTime = article.find('header.media--common__header time').text();
                      const postedDate = article.find('header.media--common__header time').attr('datetime');
                      const rating = article.find('header.media--common__header data').attr('value');
                      const caption = article.find('header.media--common__header figcaption').text();
                      const body = article.find('div.media--common__body').text().trim();
            
                      rating_arr.push({ name: name, postedTime: postedTime, postedDate: postedDate, rating: rating, caption: caption, body: body });
                    });
                  }
                  // var rating_no = $('.rating__holder .title__grotesk').text();
                  var rating_no = $('.rating__holder .title__grotesk')
                      .contents()
                      .not('.m-indent--l__5') // Exclude the element with m-indent--l__5 class
                      .text()
                      .trim();
                    // console.log(rating_no);
                  var title = $('h1.break-word-anywhere').text();
                  const data = {
                    vendor_id: new mongoose.Types.ObjectId(idds),
                    venor_profile_link: url,
                    venor_profile_title : title,
                    avg_completion_rate: values[0],
                    task_initial_domain_price: values[1],
                    avg_lifetime_link: values[2],
                    no_of_complete_task: '',
                    no_of_task_progress: '',
                    no_of_rejected_task: '',
                    no_of_approved_sites: '',
                    rating_no: rating_no,
                    rating: rating_arr,
                  };
            
                  $('.row-common--box dt').each((index, element) => {
                    const dtText = $(element).text();
                    const ddText = $(element).next('dd').text();
            
                    switch (dtText) {
                      case 'Number of completed tasks':
                        data.no_of_complete_task = ddText;
                        break;
                      case 'Number of tasks in progress':
                        data.no_of_task_progress = ddText;
                        break;
                      case 'Number of rejected tasks':
                        data.no_of_rejected_task = ddText;
                        break;
                      case 'Number of approved sites at Adsy':
                        data.no_of_approved_sites = ddText;
                        break;
                    }
                  });
            
                  // Convert the data object to JSON
                  const jsonData = JSON.stringify(data, null, 2);
            
                  // Print the JSON data
                  console.log(`Data from ${url}:`, jsonData);
                  await VendorDetailModel.create(data);
                  var id_data = new mongoose.Types.ObjectId(idds);
                  var getVenor = await VendorModel.findById(id_data);
                  console.log("getvendor",getVenor);
                  if(getVenor){
                        var process_count;
                        if(getVenor.process_count){
                            process_count = parseInt(getVenor.process_count) + 1;
                        }else{
                            process_count = 1;
                        }
                        await VendorModel.findByIdAndUpdate(getVenor._id, {process_status: true, process_count: process_count, vendor_profile_obj: data});
                  }
                }
                await VendorDetailModel.find({})
                .then((getDetail) => {
                    res.status(201).json({
                        message: "Detail get successfully!",
                        data: getDetail,
                    });
                })
                .catch((error) => {
                    res.status(404).json({
                        error: error.message,
                    });
                })
            
                // Close the browser
                await browser.close();
              } catch (error) {
                console.error('An error occurred:', error);
              }
        }

    }catch(error){
        console.log("error in createDetail in vendorDetailController",error);
    }
}

async function getByIdDetail(req, res) {
    try{
        if(!req.params){
            return res.status(404).json({
              message: "req.params is missing",
            });
          }
        const detailsId = req.params.id;
        console.log("detailsId", detailsId)
        await VendorDetailModel.findById(detailsId).populate('vendordata')
            .then((getDetail) => {
                res.status(201).json({
                    message: "Detail get successfully!",
                    data: getDetail,
                });
            })
            .catch((error) => {
                res.status(404).json({
                    error: error.message,
                });
            })
    }catch(error){
        console.log("error in getByIdDetail in vendorDetailController",error); 
    }
}

module.exports = { findAllDetail, createDetail, getByIdDetail, scrapping_createDetail };
