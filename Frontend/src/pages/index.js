import Head from "next/head";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight, HiTable } from "react-icons/hi";
import { RiNeteaseCloudMusicLine } from "react-icons/ri";
import { MdAudiotrack, MdCategory } from "react-icons/md";
import { RiPlayListFill } from "react-icons/ri";
import { BsFileMusicFill } from "react-icons/bs";
import Genres from "../../components/genres";
import { FaSignOutAlt } from "react-icons/fa";
import { removeToken } from "../../utils/token";
import { useRouter } from "next/router";
import Artists from "../../components/artists";
import Albums from "../../components/albums";
import Tracks from "../../components/Tracks";
import { useState } from "react";

const handleLogout = () => {
  // remove token from cookie
  removeToken();
};

export default function Home() {
  const { push } = useRouter();

  const [sidebarOption, setSidebarOption] = useState("Songs");

  return (
    <>
      <Head></Head>
      <main className="flex bg-slate-400">
        <div className="w-fit min-h-screen h-100%">
          <Sidebar aria-label="Sidebar with logo branding example">
            <a
              href=""
              class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              <RiNeteaseCloudMusicLine
                width={8}
                height={8}
                class="w-8 h-8 mr-2"
                alt="logo"
                color="#9ca3af"
              />
              MeloBox
            </a>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item icon={MdAudiotrack}>
                  <button onClick={() => setSidebarOption("Songs")}>
                    Songs
                  </button>
                </Sidebar.Item>
                <Sidebar.Item icon={BsFileMusicFill}>
                  <button onClick={() => setSidebarOption("Artists")}>
                    Artists
                  </button>
                </Sidebar.Item>
                <Sidebar.Item icon={MdCategory}>
                  <button onClick={() => setSidebarOption("Genres")}>
                    Genres
                  </button>
                </Sidebar.Item>
                <Sidebar.Item icon={RiPlayListFill}>
                  <button onClick={() => setSidebarOption("Albums")}>
                    Albums
                  </button>
                </Sidebar.Item>
                <Sidebar.Item href="#" icon={HiUser}>
                  User Profile
                </Sidebar.Item>
                <Sidebar.Item icon={HiArrowSmRight}>
                  <button onClick={() => push("/login")}>Sign In</button>
                </Sidebar.Item>
                <Sidebar.Item href="/register" icon={HiTable}>
                  <button onClick={() => push("/register")}>Register</button>
                </Sidebar.Item>
                <Sidebar.Item href="/login" icon={FaSignOutAlt}>
                  <button onClick={handleLogout}>Logout</button>
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>
        {sidebarOption === "Songs" ? (
          <Tracks />
        ) : sidebarOption === "Artists" ? (
          <Artists />
        ) : sidebarOption === "Genres" ? (
          <Genres />
        ) : sidebarOption === "Albums" ? (
          <Albums />
        ) : null}
      </main>
    </>
  );
}
