"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { useRouter } from "next/navigation";

interface Props {
  tweets: TweetWithAuthor[];
}

const Tweets: React.FC<Props> = ({ tweets }) => {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (currentOptimisticTweets, newTweet) => {
    const newOptimisticTweets = [...currentOptimisticTweets];
    const index = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id
    );

    newOptimisticTweets[index] = newTweet;
    return newOptimisticTweets;
  });

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase.realtime
      .channel("tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return (
    <>
      {tweets ? (
        optimisticTweets.map((tweet) => (
          <div key={tweet.id} style={{ border: "1px solid black" }}>
            <p>
              {tweet.author.name} {tweet.author.username}
            </p>
            <p>{tweet.title}</p>
            <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
          </div>
        ))
      ) : (
        <div>Tweets not found</div>
      )}
    </>
  );
};

export default Tweets;
