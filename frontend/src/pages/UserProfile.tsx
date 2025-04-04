import { useParams } from "@tanstack/react-router";

const UserProfile = () => {
  const { userId } = useParams({ strict: false }); // Get user ID from URL

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <p>Displaying profile for user ID: {userId}</p>
    </div>
  );
};

export default UserProfile;