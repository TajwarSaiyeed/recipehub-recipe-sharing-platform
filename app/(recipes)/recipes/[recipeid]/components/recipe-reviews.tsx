"use client";
import React, {FC, useEffect, useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {StarIcon} from "lucide-react";
import {Review} from "@prisma/client";
import axios from "axios";
import {Skeleton} from "@/components/ui/skeleton";
import {Separator} from "@/components/ui/separator";
import AddRecipeReviewForm from "./add-recipe-review-form"

interface RecipeReviewsProps {
    recipeId: string,
    reviewIsExists: boolean,
    me: boolean
}

type ReviewWithUser = Review & {
    user: {
        name: string;
        avatar: string;
    };
};

const RecipeReviews: FC<RecipeReviewsProps> = ({recipeId, reviewIsExists, me}) => {
    const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.post("/api/recipes/recipe-reviews", {
                    recipeId,
                });
                return response.data.reviews;
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews().then((data) => setReviews(data));

        return () => {
            setLoading(true);
            setReviews([]);
        };
    }, [recipeId, toggle]);

    return (
        <>
            <div className="mt-12">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <div className="mt-6 space-y-6">
                    {loading ? (
                        <>
                            <Skeleton className="w-full h-16 rounded-md"/>
                            <Skeleton className="w-full h-16 rounded-md"/>
                            <Skeleton className="w-full h-16 rounded-md"/>
                        </>
                    ) : reviews.length == 0 ? (
                        <p className="text-lg mt-3 text-muted-foreground">No reviews yet.</p>
                    ) : (reviews.map((review) => (
                            <div key={review.id} className="flex items-start gap-4">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage
                                        src={review.user?.avatar || "/placeholder-user.jpg"}
                                        alt={review.user?.name}
                                    />
                                    <AvatarFallback>{review.user?.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">
                                            {review.user?.name || "Anonymous"}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <StarIcon className="h-4 w-4 fill-primary"/>
                                            <span>{review.rating}</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-muted-foreground">{review.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {!me &&
                <>
                    <Separator className={'mx-auto max-w-5xl w-full mt-5'}/>
                    <AddRecipeReviewForm recipeId={recipeId} reviewIsExists={reviewIsExists} setToggle={setToggle}/>
                </>
            }
        </>
    );
};

export default RecipeReviews;
