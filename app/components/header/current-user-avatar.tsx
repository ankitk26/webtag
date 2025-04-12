import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { authQuery } from "~/lib/queries";
import { Skeleton } from "../ui/skeleton";

export const CurrentUserAvatar = () => {
  const { data: user, isPending } = useQuery(authQuery);

  if (isPending) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  const profileImage = user?.user_metadata.avatar_url;

  const initials = user?.user_metadata.name
    ?.split(" ")
    ?.map((word: string) => word[0])
    ?.join("")
    ?.toUpperCase();

  return (
    <Avatar>
      {profileImage && <AvatarImage src={profileImage} alt={initials} />}
      <AvatarFallback className="text-sm">{initials}</AvatarFallback>
    </Avatar>
  );
};
