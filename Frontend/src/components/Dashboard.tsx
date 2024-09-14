import Container from "./Container";
import UserBlog from "./UserBlog";

import UserProfile from "./UserProfile";

export default function Dashboard() {
  return (
    <Container className="flex flex-col p-4 space-x-0 space-y-3 sm:space-x-5 sm:flex-row sm:space-y-0">
      <UserProfile />
      <hr className="block border-2 sm:hidden border-primary" />
      <UserBlog />
    </Container>
  );
}
