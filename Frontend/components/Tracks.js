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

export default function Tracks() {
  const [refresh, setRefresh] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [trackId, setTrackId] = useState();

  const [tracks, setTracks] = useState();

  const [createTrackName, setCreateTrackName] = useState("");
  const [createTrackDuration, setCreateTrackDuration] = useState("");
  const [createTrackAlbumId, setCreateTrackAlbumId] = useState("");
  const [createTrackGenreId, setCreateTrackGenreId] = useState("");
  const [createTrackArtistId, setCreateTrackArtistId] = useState("");

  const editTrackNameRef = useRef("");
  const editTrackPopularityScoreRef = useRef("");
  const editTrackArtistIdRef = useRef("");

  useEffect(() => {
    fetch("http://localhost:5000/alltracks") // fetch data from the API
      .then((response) => response.json()) // parse JSON data into JS object
      .then((data) => {
        console.log(data);
        setTracks(data); // set data in the state
      });
  }, [refresh]);

  const handleTrackSubmit = async (e) => {
    console.log(createTrackArtistId);
    e.preventDefault();
    e.target.reset();
    const response = await fetch("http://localhost:5000/tracks/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodeToken().token}`,
      },
      body: JSON.stringify({
        title: createTrackName,
        duration: createTrackDuration,
        album_id: createTrackAlbumId,
        genre_id: createTrackGenreId,
        artist_id: createTrackArtistId,
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

  // Delete track
  const handleTrackDelete = async (track_id) => {
    let trackId = track_id;
    const response = await fetch(`http://localhost:5000/tracks/${trackId}`, {
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

  const handleEditTrack = async (track_id) => {
    let trackId = track_id;
    let trackName = editTrackNameRef.current;
    let trackPopularityScore = editTrackPopularityScoreRef.current;
    let editTrackArtistId = editTrackArtistIdRef.current;
    const response = await fetch(`http://localhost:5000/tracks/${trackId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodeToken().token}`,
      },
      body: JSON.stringify({
        name: trackName,
        duration: trackPopularityScore,
        artist_id: editTrackArtistId,
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
            Edit Tracks:
          </h3>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>Track ID</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Duration</Table.HeadCell>
              <Table.HeadCell>Album ID</Table.HeadCell>
              <Table.HeadCell>Genre ID</Table.HeadCell>
              <Table.HeadCell>Artist ID</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Delete</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {tracks && (
                <>
                  {tracks.map((track, index) => (
                    <Table.Row
                      key={track.track_id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {track.track_id}
                      </Table.Cell>
                      <Table.Cell>{track.title}</Table.Cell>
                      <Table.Cell>{track.duration}</Table.Cell>
                      <Table.Cell>{track.album_id}</Table.Cell>
                      <Table.Cell>{track.genre_id}</Table.Cell>
                      <Table.Cell>{track.artist_id}</Table.Cell>

                      <>
                        <Table.Cell style={{ cursor: "pointer" }}>
                          <a
                            onClick={() => {
                              setTrackId(track.track_id);
                              setEditModal(true);
                            }}
                            className="font-medium text-yellow-400 hover:underline dark:text-yellow-300"
                          >
                            Edit
                          </a>

                          <Modal
                            key={track.track_id}
                            show={editModal}
                            size="md"
                            popup={true}
                            onClose={() => setEditModal(false)}
                          >
                            <Modal.Header />
                            <Modal.Body>
                              <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                  Edit Track
                                </h3>
                                <div>
                                  <div className="mb-2 block">
                                    <Label
                                      htmlFor="edit_track_name"
                                      value="Name"
                                    />
                                  </div>
                                  <TextInput
                                    id="edit_track_name"
                                    placeholder={track.name}
                                    required={true}
                                    onChange={(e) => {
                                      editTrackNameRef.current = e.target.value;
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="mb-2 block">
                                    <Label
                                      htmlFor="track_duration"
                                      value="Duration"
                                    />
                                  </div>
                                  <TextInput
                                    id="track_duration"
                                    placeholder={track.duration}
                                    type="text"
                                    required={true}
                                    onChange={(e) => {
                                      editTrackPopularityScoreRef.current =
                                        e.target.value;
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="mb-2 block">
                                    <Label
                                      htmlFor="track_artist_id"
                                      value="Artist ID"
                                    />
                                  </div>
                                  <TextInput
                                    id="track_artist_id"
                                    type="text"
                                    placeholder="What's the ID of its artist?"
                                    required={true}
                                    onChange={(e) => {
                                      editTrackArtistIdRef.current =
                                        e.target.value;
                                    }}
                                  />
                                </div>
                                <div className="w-full">
                                  <Button
                                    onClick={() => handleEditTrack(trackId)}
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
                              setTrackId(track.track_id);
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
                                    Are you sure you want to delete this track?
                                  </h3>
                                  <div className="flex justify-center gap-4">
                                    <Button
                                      color="failure"
                                      onClick={() => handleTrackDelete(trackId)}
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
          onSubmit={handleTrackSubmit}
        >
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Add Track:
          </h3>
          <div>
            <div className="mb-2 block">
              <Label
                style={{ color: "white" }}
                htmlFor="create_track_name"
                value="Name"
              />
            </div>
            <TextInput
              id="create_track_name"
              type="text"
              placeholder="ex: Red Lights"
              required={true}
              onChange={(e) => {
                setCreateTrackName(e.target.value);
              }}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label
                style={{ color: "white" }}
                htmlFor="track_duration"
                value="Duration"
              />
            </div>
            <TextInput
              id="track_duration"
              type="text"
              placeholder="ex: 245"
              required={true}
              onChange={(e) => {
                setCreateTrackDuration(e.target.value);
              }}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                style={{ color: "white" }}
                htmlFor="track_album_id"
                value="Album ID"
              />
            </div>
            <TextInput
              id="track_album_id"
              type="text"
              placeholder="What's the ID of its album?"
              required={true}
              onChange={(e) => {
                setCreateTrackAlbumId(e.target.value);
              }}
            />
          </div>
          <div className="mb-2 block">
            <div>
              <Label
                style={{ color: "white" }}
                htmlFor="track_genre_id"
                value="Genre ID"
              />
            </div>
            <TextInput
              id="track_genre_id"
              type="text"
              placeholder="What's the ID of its genre?"
              required={true}
              onChange={(e) => {
                setCreateTrackGenreId(e.target.value);
              }}
            />
          </div>
          <div className="mb-2 block">
            <div>
              <Label
                style={{ color: "white" }}
                htmlFor="track_artist_id"
                value="Artist ID"
              />
            </div>
            <TextInput
              id="track_artist_id"
              type="text"
              placeholder="What's the ID of its artist?"
              required={true}
              onChange={(e) => {
                setCreateTrackArtistId(e.target.value);
              }}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}
