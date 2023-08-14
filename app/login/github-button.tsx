"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
interface Props {}

const GitHubButton: React.FC<Props> = ({}) => {
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };
  return <button onClick={handleSignIn} className="hover:bg-gray-800 rounded-xl p-8">
    <Image src={"/github-mark-white.svg"} alt="github logo" width={100} height={100}/>
  </button>;
};

export default GitHubButton;
