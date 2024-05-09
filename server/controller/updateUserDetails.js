const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const UserModel = require("../models/userModel")

async function updateUserDetails(request,response){
    try {
        const token = request.cookies.token || ""

        if (!token) {
            return response.status(401).json({
                message: "Authentication token is missing",
                error: true
            });
        }

        // Ensure user exists before proceeding
        const user = await getUserDetailsFromToken(token)

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true
            });
        }

        const { name, profile_pic } = request.body;

        if (!name && !profile_pic) {
            return response.status(400).json({
                message: "No update information provided",
                error: true
            });
        }

        const update = {};
        if (name) update.name = name;
        if (profile_pic) update.profile_pic = profile_pic;

        const updateUser = await UserModel.updateOne({ _id: user._id }, update);

        if (updateUser.nModified === 0) {
            return response.status(304).json({
                message: "No changes made to the user details",
                success: true
            });
        }

        const userInformation = await UserModel.findById(user._id)

        return response.json({
            message : "User details updated",
            data : userInformation,
            success : true
        });

    } catch (error) {
        console.error("Error updating user details:", error);
        return response.status(500).json({
            message: error.message || "An unexpected error occurred",
            error: true
        });
    }
}

module.exports = updateUserDetails