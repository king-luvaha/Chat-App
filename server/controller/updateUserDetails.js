const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const UserModel = require("../models/userModel")

async function updateUserDetails(request,response){
    try {
        const token = request.cookies.token || ""

        // Ensure user exists before proceeding
        const user = await getUserDetailsFromToken(token)

        

        const { name, profile_pic } = request.body

        const updateUser = await UserModel.updateOne({ _id : user._id },{
            name,
            profile_pic
        })

        const userInformation = await UserModel.findById(user._id)

        return response.json({
            message : "User details updated succesfully",
            data : userInformation,
            success : true
        })

    } catch (error) {
        console.error("Error updating user details:", error);
        return response.status(500).json({
            message: error.message || "An unexpected error occurred",
            error: true
        });
    }
}

module.exports = updateUserDetails