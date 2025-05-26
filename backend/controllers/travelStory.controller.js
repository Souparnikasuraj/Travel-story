import TravelStory from "../models/travelStory.model.js";
import { errorHandler } from "../utils/error.js";

export const addTravelStory = async (req, res, next) => {
    const {title, story, visitedLocation, imageUrl, visitedDate} = req.body;

    const userId = req.user.id

    //validate required field
    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
        return next(errorHandler(400, "All fields are required"));
    }

    //convert visited data from milliseconds to data object
    const parsedVisitedDate = new Date(parseInt(visitedDate))

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
        })
        await travelStory.save();

        res.status(201).json({
            story: travelStory,
            message: "Travel story added successfully!",
        })
    }catch (error) {
        next(error)
    }
}

export const getAllTravelStory = async (req, res, next) => {
    const userId = req.user.id;

    try{
        const travelStories = await TravelStory.find({userId: userId}).sort({
            isFavorite: -1,
        })
        res.status(200).json({stories: travelStories})
    }catch(error){
        next(error);
    }
}