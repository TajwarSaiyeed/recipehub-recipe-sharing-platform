import React from "react";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getUserDetails} from "@/actions/get-user-details-with-avg-rating";
import ProfileForm from "@/app/(root)/me/profile/profile-form";
import ImageUploadButton from "@/app/(root)/me/profile/image-upload-button";

const Profile = async () => {
    const session = await auth();
    if (!session) return redirect("/sign-in?callbackUrl=/me/profile");
    const {user, avgRating} = await getUserDetails(session.user.id);
    return (
        <div className="w-full max-w-3xl mx-auto py-8 md:py-12 px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <div className="flex-shrink-0">
                    <Avatar className="w-20 h-20 md:w-24 md:h-24">
                        <AvatarImage src={`${user?.image || ""}?${new Date().getTime()}`} alt={user?.name || ""}/>
                        <AvatarFallback>
                            {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-1 space-y-1">
                    <h1 className="text-2xl text-center md:text-left md:text-3xl font-bold">
                        {user?.name}
                    </h1>
                    <p className="text-muted-foreground">
                        {avgRating ? `Average rating: ${avgRating.toFixed(2)}` : "No ratings yet"
                        }</p>
                </div>
                <div className="flex-shrink-0">
                    <ImageUploadButton image={user?.image || ""}/>
                </div>
            </div>
            <ProfileForm uid={user?.id || ""} username={user?.name || ""} email={user?.email || ""}/>
        </div>
    )
};

export default Profile;