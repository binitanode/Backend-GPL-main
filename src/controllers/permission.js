async function getAllPermissionData(req, res) {
  try{
    const findAllPermissionData = {
      USERS: "Users",
      DASHBOARD: "Dashboard",
      ROLES: "Roles",
      GPLDATA: "GplData",
    };
    res.status(200).json({
      message: "Permissions get successfully",
      data: findAllPermissionData,
    });
  }catch(error){
    console.log("error in getAllPermissionData in permission",error);
  }
}

module.exports = { getAllPermissionData };
