import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";
import Likes from "./likes";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }
  const { data: tweets } = await supabase
    .from("tweets")
    .select("*, profiles(*)");

  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      {tweets ? (
        tweets.map((tweet) => (
          <div key={tweet.id} style={{ border: "1px solid black" }}>
            <p>
              {tweet.profiles?.name} {tweet.profiles?.username}
            </p>
            <p>{tweet.title}</p>
            <Likes />
          </div>
        ))
      ) : (
        <div>Tweets not found</div>
      )}
    </>
  );
}
