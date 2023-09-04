import { Inter } from "next/font/google";
import Head from "next/head";
import {
  Button,
  Label,
  Modal,
  Table,
  TextInput,
  Textarea,
} from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { decodeToken } from "../utils/auth";

export default function Albums() {
  const [refresh, setRefresh] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [albumId, setAlbumId] = useState();

  const [albums, setAlbums] = useState();

  const [createAlbumName, setCreateAlbumName] = useState("");
  const [createAlbumPopularityScore, setCreateAlbumPopularityScore] =
    useState("");
  const [createAlbumArtistId, setCreateAlbumArtistId] = useState("");

  const editAlbumNameRef = useRef("");
  const editAlbumPopularityScoreRef = useRef("");
  const editAlbumArtistIdRef = useRef("");

  useEffect(() => {
    fetch("http://localhost:5000/allalbums") // fetch data from the API
      .then((response) => response.json()) // parse JSON data into JS object
      .then((data) => {
        console.log(data);
        setAlbums(data); // set data in the state
      });
  }, [refresh]);

  const handleAlbumSubmit = async (e) => {
    console.log(createAlbumArtistId);
    e.preventDefault();
    e.target.reset();
    const response = await fetch("http://localhost:5000/albums/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodeToken().token}`,
      },
      body: JSON.stringify({
        name: createAlbumName,
        release_date: createAlbumPopularityScore,
        artist_id: createAlbumArtistId,
      }),
    });
    console.log("Decoded token: ", decodeToken().token);
    if (response.status == 201) {
      const data = await response.json();
      setRefresh(!refresh);
      console.log(data);
    } else {
      console.log(response);
    }
  };

  // Delete album
  const handleAlbumDelete = async (album_id) => {
    let albumId = album_id;
    const response = await fetch(`http://localhost:5000/albums/${albumId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodeToken().token}`,
      },
    });
    if (response.status == 200) {
      const data = await response.json();
      setRefresh(!refresh);
      setDeleteModal(false);
      console.log(data);
    } else {
      console.log(response);
    }
  };

  const handleEditAlbum = async (album_id) => {
    let albumId = album_id;
    let albumName = editAlbumNameRef.current;
    let albumPopularityScore = editAlbumPopularityScoreRef.current;
    let editAlbumArtistId = editAlbumArtistIdRef.current;
    const response = await fetch(`http://localhost:5000/albums/${albumId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodeToken().token}`,
      },
      body: JSON.stringify({
        name: albumName,
        release_date: albumPopularityScore,
        artist_id: editAlbumArtistId,
      }),
    });
    if (response.status == 200) {
      const data = await response.json();
      setRefresh(!refresh);
      setEditModal(false);
      console.log(data);
    } else {
      console.log(response);
    }
  };

  return (
    <div className="flex p-5 w-full pb-10">
      <div className="flex flex-col w-full items-center gap-20">
        <div className="min-w-full p-5">
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 pb-5">
            Edit Albums:
          </h3>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>Album ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Release Date</Table.HeadCell>
              <Table.HeadCell>Artist ID</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Delete</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {albums && (
                <>
                  {albums.map((album, index) => (
                    <Table.Row
                      key={album.album_id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {album.album_id}
                      </Table.Cell>
                      <Table.Cell>{album.name}</Table.Cell>
                      <Table.Cell>{album.release_date}</Table.Cell>
                      <Table.Cell>{album.artist_id}</Table.Cell>
                      <>
                        <Table.Cell style={{ cursor: "pointer" }}>
                          <a
                            onClick={() => {
                              setAlbumId(album.album_id);
                              setEditModal(true);
                            }}
                            className="font-medium text-yellow-400 hover:underline dark:text-yellow-300"
                          >
                            Edit
                          </a>

                          <Modal
                            key={album.album_id}
                            show={editModal}
                            size="md"
                            popup={true}
                            onClose={() => setEditModal(false)}
                          >
                            <Modal.Header />
                            <Modal.Body>
                              <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                  Edit Album
                                </h3>
                                <div>
                                  <div className="mb-2 block">
                                    <Label
                                      htmlFor="edit_album_name"
                                      value="Name"
                                    />
                                  </div>
                                  <TextInput
                                    id="edit_album_name"
                                    placeholder={album.name}
                                    required={true}
                                    onChange={(e) => {
                                      editAlbumNameRef.current = e.target.value;
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="mb-2 block">
                                    <Label
                                      htmlFor="album_release_date"
                                      value="Release Date"
                                    />
                                  </div>
                                  <TextInput
                                    id="album_release_date"
                                    placeholder={album.release_date}
                                    type="text"
                                    required={true}
                                    onChange={(e) => {
                                      editAlbumPopularityScoreRef.current =
                                        e.target.value;
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="mb-2 block">
                                    <Label
                                      htmlFor="album_artist_id"
                                      value="Artist ID"
                                    />
                                  </div>
                                  <TextInput
                                    id="album_artist_id"
                                    type="text"
                                    placeholder="What's the ID of its artist?"
                                    required={true}
                                    onChange={(e) => {
                                      editAlbumArtistIdRef.current =
                                        e.target.value;
                                    }}
                                  />
                                </div>
                                <div className="w-full">
                                  <Button
                                    onClick={() => handleEditAlbum(albumId)}
                                    className="w-full  bg-yellow-600 dark:bg-yellow-500 hover:bg-yellow-700 dark:hover:bg-yellow-600"
                                  >
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </Modal.Body>
                          </Modal>
                        </Table.Cell>
                        <Table.Cell style={{ cursor: "pointer" }}>
                          <a
                            className="font-medium text-red-600 hover:underline dark:text-red-500"
                            onClick={() => {
                              setAlbumId(album.album_id);
                              setDeleteModal(true);
                            }}
                          >
                            Delete
                          </a>
                          <>
                            <Modal
                              show={deleteModal}
                              size="md"
                              popup={true}
                              onClose={() => setDeleteModal(false)}
                            >
                              <Modal.Header />
                              <Modal.Body>
                                <div className="text-center">
                                  <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Are you sure you want to delete this album?
                                  </h3>
                                  <div className="flex justify-center gap-4">
                                    <Button
                                      color="failure"
                                      onClick={() => handleAlbumDelete(albumId)}
                                    >
                                      Yes, I'm sure
                                    </Button>
                                    <Button
                                      color="gray"
                                      onClick={() => {
                                        setDeleteModal(false);
                                      }}
                                    >
                                      No, cancel
                                    </Button>
                                  </div>
                                </div>
                              </Modal.Body>
                            </Modal>
                          </>
                        </Table.Cell>
                      </>
                    </Table.Row>
                  ))}
                </>
              )}
            </Table.Body>
          </Table>
        </div>
        <form
          className="flex flex-col gap-4 w-full md:w-3/5"
          onSubmit={handleAlbumSubmit}
        >
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Add Album:
          </h3>
          <div>
            <div className="mb-2 block">
              <Label
                style={{ color: "white" }}
                htmlFor="create_album_name"
                value="Name"
              />
            </div>
            <TextInput
              id="create_album_name"
              type="text"
              placeholder="ex: Red Lights"
              required={true}
              onChange={(e) => {
                setCreateAlbumName(e.target.value);
              }}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                style={{ color: "white" }}
                htmlFor="album_release_date"
                value="Release Date"
              />
            </div>
            <TextInput
              id="album_release_date"
              type="text"
              placeholder="ex: Tue, 22 Feb 2022 00:00:00 GMT"
              required={true}
              onChange={(e) => {
                setCreateAlbumPopularityScore(e.target.value);
              }}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                style={{ color: "white" }}
                htmlFor="album_artist_id"
                value="Artist ID"
              />
            </div>
            <TextInput
              id="album_artist_id"
              type="text"
              placeholder="What's the ID of its artist?"
              required={true}
              onChange={(e) => {
                setCreateAlbumArtistId(e.target.value);
              }}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}
