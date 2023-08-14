"use client";

import Likes from "./likes";
import { experimental_useOptimistic as useOptimistic } from "react";

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
