import Container from "./Container";
import Slider from "./Slider";

import RecentPost from "./RecentPost";
import Categories from "./Categories";
import BlogList from "./BlogList";

export default function Home() {
  return (
    <div className="pt-4 bg-white dark:bg-primary">
      <Container className="flex space-x-5">
        <div className="space-y-2 md:w-2/3">
          <Slider />
          <hr className="border-2 border-black dark:border-gray-600" />
          <div className="block md:hidden">
            <RecentPost />
          </div>
          <BlogList />
        </div>
        <div className="hidden w-1/3 p-2 space-y-2 md:block">
          <RecentPost />
          <Categories />
        </div>
      </Container>
    </div>
  );
}
