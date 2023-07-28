const VendorDetailModel = require("../models/vendorDetailModel");
const { getVendorDetail, count } = require("../services/vendorDetail.service");
const VendorModel = require("../models/vendorModel");
const puppeteer = require('puppeteer');
// const puppeteer = require('puppeteer-core');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const puppeteerPageProxy = require('puppeteer-page-proxy');
const redisClient = require("../../redis.js"); 
const LogModel = require("../models/logModel");
// const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const fs = require('fs');

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'records.guestpostlinks.net',
  port: 465,
  auth: {
    user: 'gpl_sendmail@records.guestpostlinks.net', 
    pass: 'gpl_sendmail@1234' 
  }
})

async function findAllDetail(req, res, next) {
  try {
    if (!req) {
      return res.status(404).json({
        message: "req.body is missing",
      });
    }
    const cacheKey = "getVendorDetail";

  // Check if data is in the cache
  redisClient.get(cacheKey, async (err, data) => {
    console.log("call redis");
    if (err) {
      console.error("Error retrieving data from Redis cache:", err);
      return res.status(500).json({ error: "Server Error" });
    }

    if (data) {
      console.log("Serving getVendorDetail from cache...");
      return res.json(JSON.parse(data)); // Serve the data from the cache
    }
    console.log("err, data", err, data);
    // If data is not in the cache, fetch it from the database
    try {
      const findAllData = await getVendorDetail(req)
      const dataCount = await count()
 

      // Store the fetched data in the cache for future requests
      redisClient.setex(cacheKey, 3600, JSON.stringify(findAllData));

      console.log("Serving getVendorDetail from the database...");
      // res.json(findAllData); // Serve the data from the database
      res.status(200).json({
        message: "Get All Data Successfully!",
        data: findAllData,
        totalCount: dataCount,
        rowCount: findAllData.length
      })

    } catch (error) {
      console.error("Error fetching data from the database:", error);
      res.status(500).json({ error: "Server Error" });
    }
  });

  } catch (error) {
    // next(error)
    console.log("error in findAllDetail in vendorDetailController", error);
  }
}

async function createDetail(req, res) {
  try {
    if (!req.body) {
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
  } catch (error) {
    console.log("error in createDetail in vendorDetailController", error);
  }
}

async function scrapping_createDetail(req, res) {
  try {

      // const  mailOptions = {
      //   from: 'gpl_sendmail@records.guestpostlinks.net',
      //   to: 'binita.g@amrytt.com', 
      //   subject: 'scraping pending',
      //   html: `<h4>test : scraping pending</h4>` 
      // };

      // transporter.sendMail(mailOptions, (error, info) => {
      //   if (error) {
      //     console.log('Error sending email:', error);
      //   } else {
      //     console.log('Email sent:', info.response);
      //   }
      // });

    if (!req.body) {
      return res.status(404).json({
        message: "req.body is missing",
      });
    }
    var url_arr = [];
    var ids_arr = [];
    var getalllink = await VendorModel.find({});
    
    if (getalllink) {
      for (let g = 0; g < Math.min(getalllink.length, 5); g++) {
        // for (let g = 0; g < getalllink.length; g++) {
        url_arr.push({ url: getalllink[g].profileLink, idds: getalllink[g]._id });
      }
    }
    console.log("url_arr", url_arr);
    
    if (url_arr) {
      try {
        const proxylist = await listProxies().then((res) => { console.log(res) });
        // return false;
        // console.log("proxylist", proxylist);

        const username = 'ceo@amrytt.com';
        const password = 'Jhd@27489107';

        const proxyServer = 'http://107.181.153.118:5489';
        'socks5://154.12.76.95:154.12.76.95';
        const proxyHost = '2.56.119.93';
        const proxyPort = '5489';
        const proxyUsername = 'tvhtyzlk';
        const proxyPassword = 'nx7rzzxii90l';

        // 2.56.119.93:5074:hgfcnpfq:4q1umwtss5q4
        // 185.199.229.156:7492:hgfcnpfq:4q1umwtss5q4
        // 185.199.228.220:7300:hgfcnpfq:4q1umwtss5q4
        const proxyServersData = [
          {
            server: 'socks5://2.56.119.93:5074',
            username: 'hgfcnpfq',
            password: '4q1umwtss5q4',
          },
          {
            server: 'socks5://185.199.229.156:7492',
            username: 'hgfcnpfq',
            password: '4q1umwtss5q4',
          },
          {
            server: 'socks5://185.199.228.220:7300',
            username: 'hgfcnpfq',
            password: '4q1umwtss5q4',
          }
        ];

        // let success = false;
        // for (const proxy of proxyServersData) {
        //        const browser = await puppeteer.launch({
                //   headless: false,
                //   args: [
                //     `--proxy-server=${proxy.server}`,
                //     '--disable-web-security',
                //   ],
                // });
                // await page.authenticate({
                //   proxy.username,
                //   proxy.password
                // });
        //   if (success) {
        //     break;
        //   }
        // }

        const browser = await puppeteer.launch({
          headless: false,
          args: [
            '--ignore-default-args=--disable-extensions',
            `--proxy-server=${proxyServer}`,
            '--disable-web-security',
          ],
        });
        // const browser = await puppeteer.launch({
        //   executablePath: '/usr/bin/chromium-browser',
        //   headless: true, // Set to false if you want to see the browser window
        //   args: ['--no-sandbox']
        // });
        // const browser = await puppeteer.launch({ headless: false, args: ['--disable-web-security'] });
        const page = await browser.newPage();

        page.setDefaultNavigationTimeout(60000);

        await page.authenticate({
          proxyUsername,
          proxyPassword
        });
        
        const sessionStorageString = fs.readFileSync('sessionStorage.json', 'utf8');
      
        const localStorageString = fs.readFileSync('localStorage.json', 'utf8');

        if (sessionStorageString.trim() !== '') {
          const sessionStorage = JSON.parse(sessionStorageString);
          if (sessionStorage && Object.keys(sessionStorage).length > 0) {
            console.log("sessionStorage add");
            // await page.evaluate((data) => {
            await page.evaluateOnNewDocument((data) => {
              for (const [key, value] of Object.entries(data)) {
                // sessionStorage[key] = value;
                sessionStorage.setItem(key, JSON.stringify(value));
              }
            }, sessionStorage);
          }
        }

        if (localStorageString.trim() !== '') {
          const localStorageData = JSON.parse(localStorageString);
          if (localStorageData && Object.keys(localStorageData).length > 0) {
            console.log("localStorage add");
            await page.evaluateOnNewDocument((data) => {
              for (const [key, value] of Object.entries(data)) {
                localStorage.setItem(key, JSON.stringify(value));
              }
            }, localStorageData);
          }
        }

        const cookiesString = fs.readFileSync('cookies.json', 'utf8');
        if (cookiesString.trim() !== '') {
            console.log("cookies through login 1");
            const cookiesRead = JSON.parse(cookiesString);
            if (cookiesRead && Object.keys(cookiesRead).length > 0) {
                console.log("cookies through login 2");
              await page.setCookie(...cookiesRead);
              await page.goto('https://cp.adsy.com/marketer/platform/publisher-page/77719', { waitUntil: 'networkidle0' });

            }else{
              console.log("normal login 1");
              await page.goto('https://cp.adsy.com/marketer/platform/publisher-page/77719', { waitUntil: 'networkidle0' });
              // Fill in the login form
              await page.waitForSelector('input[name="LoginForm[email]"]', { visible: true });
              await page.type('input[name="LoginForm[email]"]', username);
              await page.type('input[name="LoginForm[password]"]', password);

              // // Submit the login form
              await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
                page.evaluate(() => document.querySelector('form').submit())
              ]);
            }
         } else {
            console.log("normal login 2");
            await page.goto('https://cp.adsy.com/marketer/platform/publisher-page/77719', { waitUntil: 'networkidle0' });
            // Fill in the login form
            await page.waitForSelector('input[name="LoginForm[email]"]', { visible: true });
            await page.type('input[name="LoginForm[email]"]', username);
            await page.type('input[name="LoginForm[password]"]', password);

            // // Submit the login form
            await Promise.all([
              page.waitForNavigation({ waitUntil: 'networkidle0' }),
              page.evaluate(() => document.querySelector('form').submit())
            ]);
          }
        // await page.goto('https://www.google.com/', { waitUntil: 'networkidle0' });
        
        // return false;
        // Fill in the login form
        // await page.waitForSelector('input[name="LoginForm[email]"]', { visible: true });
        // await page.type('input[name="LoginForm[email]"]', username);
        // await page.type('input[name="LoginForm[password]"]', password);

        // // // Submit the login form
        // await Promise.all([
        //   page.waitForNavigation({ waitUntil: 'networkidle0' }),
        //   page.evaluate(() => document.querySelector('form').submit())
        // ]);


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
        var scrapingIsPending = false;
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
            venor_profile_title: title,
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
          scrapingIsPending = true;

          // Convert the data object to JSON
          const jsonData = JSON.stringify(data, null, 2);

          // Print the JSON data
          console.log(`Data from ${url}:`, jsonData);
          await VendorDetailModel.create(data);
          var id_data = new mongoose.Types.ObjectId(idds);
          var getVenor = await VendorModel.findById(id_data);
          console.log("getvendor", getVenor);
          if (getVenor) {
            var process_count;
            if (getVenor.process_count) {
              process_count = parseInt(getVenor.process_count) + 1;
            } else {
              process_count = 1;
            }
            await VendorModel.findByIdAndUpdate(getVenor._id, { process_status: true, process_count: process_count, vendor_profile_obj: data });
          }
        }
        // if (scrapingIsPending) {
        //   const  mailOptions = {
        //     from: 'gpl_sendmail@records.guestpostlinks.net',
        //     to: 'binita.g@amrytt.com', 
        //     subject: 'scraping pending',
        //     html: `<h4>test : scraping pending</h4>` 
        //   };

        //   transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //       console.log('Error sending email:', error);
        //     } else {
        //       console.log('Email sent:', info.response);
        //     }
        //   });
        // }
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

          const sessionStorage = await page.evaluate(() =>JSON.stringify(sessionStorage));
          const localStorage = await page.evaluate(() => JSON.stringify(localStorage));
        
          fs.writeFileSync("./sessionStorage.json", sessionStorage);
          fs.writeFileSync("./localStorage.json", localStorage);
          // fs.writeFileSync("sessionStorage.json", sessionStorage_write);
          // fs.writeFileSync("localStorage.json", localStorage_write);
          // const sessionData = await page.evaluate(() => JSON.stringify(sessionStorage));
          // const localStorageData = await page.evaluate(() => JSON.stringify(localStorage));
        
          // Write sessionData and localStorageData to a JSON file
          // fs.writeFileSync('sessionStorage.json', sessionStorage_write);
          // fs.writeFileSync('localStorage.json', localStorage_write);

          const cookies = await page.cookies();
          const cookieJson = JSON.stringify(cookies)
          fs.writeFileSync('cookies.json', cookieJson)
        // Close the browser
        await browser.close();
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }

  } catch (error) {
    console.log("error in createDetail in vendorDetailController", error);
  }
}

async function getByIdDetail(req, res) {
  try {
    if (!req.params) {
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
  } catch (error) {
    console.log("error in getByIdDetail in vendorDetailController", error);
  }
}
async function listProxies() {

  const web_share_api = 'tfu5tt3wpnhwasyjkzbxn3qzj4dmy2q88ovrziyj';
  const url = new URL('https://proxy.webshare.io/api/v2/proxy/list/')
  url.searchParams.append('mode', 'direct')
  url.searchParams.append('page', '1')
  url.searchParams.append('page_size', '100')
  url.searchParams.append('country_code__in', 'US')
  // url.searchParams.append('city_name', 'New York')

  const req = await fetch(url.href, {
    method: "GET",
    headers: {
      Authorization: web_share_api
    }
  })

  const res = await req.json()
  return res;
  // { count: 1, next: null, previous: null,
  // results: [{ id: 'd-2855083031', username: 'hgfcnpfq',
  // password: '4q1umwtss5q4', proxy_address: '2.56.119.93',
  // port: 5074, valid: true, last_verification: '2023-07-20T01:28:27.641725-07:00',
  // country_code: 'US', city_name: 'Los Angeles', asn_name: 'Dedipath-Llc',
  // asn_number: 35913, high_country_confidence: true, created_at: '2023-03-17T11:31:15.318134-07:00' }] }
}

function createScrapingPendingEmail(profileLink) {
  return {
    from: 'your-email@example.com',
    to: 'recipient@example.com',
    subject: 'Scraping Pending',
    html: `<p>Scraping is pending for profile link: ${profileLink}</p>`,
  };
}

// Define other email templates for scraping completed and error scenarios.


module.exports = { findAllDetail, createDetail, getByIdDetail, scrapping_createDetail };

// async function scrapping_createDetail(req, res) {
//   try {
//     // ... Your previous code ...

//     const proxyServersData = [
//       {
//         server: 'socks5://2.56.119.93:5074',
//         username: 'hgfcnpfq',
//         password: '4q1umwtss5q4',
//       },
//       {
//         server: 'socks5://185.199.229.156:7492',
//         username: 'hgfcnpfq',
//         password: '4q1umwtss5q4',
//       },
//       {
//         server: 'socks5://185.199.228.220:7300',
//         username: 'hgfcnpfq',
//         password: '4q1umwtss5q4',
//       }
//     ];

//     let success = false;
//     for (const proxy of proxyServersData) {
//       try {
//         // Attempt to launch Puppeteer with the current proxy
//         const browser = await puppeteer.launch({
//           headless: false,
//           args: [
//             `--proxy-server=${proxy.server}`,
//             '--disable-web-security',
//           ],
//         });

//         const page = await browser.newPage();
//         page.setDefaultNavigationTimeout(60000);

//         await page.authenticate({
//           username: proxy.username,
//           password: proxy.password,
//         });

//         await page.goto('https://cp.adsy.com/marketer/platform/publisher-page/77719', { waitUntil: 'networkidle0' });
//         // await page.goto('https://www.google.com/', { waitUntil: 'networkidle0' });
        
//         // ... Continue with the rest of your code ...

//         // If the Puppeteer operation was successful, set the 'success' flag to true
//         success = true;

//         // Close the browser
//         await browser.close();

//         // Break out of the loop since we don't need to try other proxies
//         break;
//       } catch (error) {
//         console.error('An error occurred with the current proxy:', error);
//         // If the current proxy failed, continue to the next one in the loop
//         continue;
//       }
//     }

//     if (!success) {
//       console.error('All proxy servers failed. Could not complete the operation.');
//       // Handle the scenario where all proxies have failed
//       return res.status(500).json({
//         message: 'All proxy servers failed. Could not complete the operation.',
//       });
//     }

//     // ... Continue with the rest of your code ...

//   } catch (error) {
//     console.log("error in createDetail in vendorDetailController", error);
//   }
// }


