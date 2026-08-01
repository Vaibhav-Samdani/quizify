import { type User } from "next-auth";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { type AvatarProps } from "@radix-ui/react-avatar";
import { User as UserIcon } from "lucide-react";

interface Props extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar = ({ user, ...props }: Props) => {
  // Helper logic to extract the user's initials (e.g., "John Doe" -> "JD")
  const initials = user.name
    ?.split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            alt={user.name ? `${user.name}'s profile picture` : "Profile picture"}
            referrerPolicy="no-referrer"
            className="object-cover" // Prevents the image from stretching
            sizes="(max-width: 768px) 40px, 40px" 
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name || "User"}</span>
          {initials ? (
            <span className="font-semibold">{initials}</span>
          ) : (
            <UserIcon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          )}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;