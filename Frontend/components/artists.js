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

export default function Artists() {
  const [refresh, setRefresh] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [artistId, setArtistId] = useState();

  //   const [genreArray, setGenreArray] = useState([]);

  //   const [genres, setGenres] = useState();

  const [artists, setArtists] = useState();

  const [createArtistName, setCreateArtistName] = useState("");
  const [createArtistPopularityScore, setCreateArtistPopularityScore] =
    useState("");
  const [createArtistGenreId, setCreateArtistGenreId] = useState("");

  const editArtistNameRef = useRef("");
  const editArtistPopularityScoreRef = useRef("");
  const editArtistGenreIdRef = useRef("");

  useEffect(() => {
    fetch("http://localhost:5000/allartists") // fetch data from the API
      .then((response) => response.json()) // parse JSON data into JS object
      .then((data) => {
        setArtists(data); // set data in the state
        // data.map((artist) => {
        //   getGenreFromId(artist.genre_id);
        // });

        // console.log(data);
      });

    // fetch("http://localhost:5000/allgenres") // fetch data from the API
    //   .then((response) => response.json()) // parse JSON data into JS object
    //   .then((data) => {
    //     setGenres(data); // set data in the state
    //     console.log(data);
    //   });
  }, [refresh]);

  //   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //   const getGenreFromId = (genreID) => {
  //     // setRefresh(!refresh);
  //     let genreName = "";
  //     console.log("Genres: ", genres);

  //     genres?.map((genre) => {
  //       console.log("Genre: ", genre.genre_id);
  //       console.log("Genre ID: ", genreID);
  //       if (genre.genre_id == genreID) {
  //         console.log("Genre name: ", genre.genre);
  //         setGenreArray([...genreArray, genre.genre]);
  //       }
  //     });
  //   };

  const handleArtistSubmit = async (e) => {
    console.log(createArtistGenreId);
    e.preventDefault();
    e.target.reset();
    const response = await fetch("http://localhost:5000/artists/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodeToken().token}`,
      },
      body: JSON.stringify({
        name: createArtistName,
        popularity_score: createArtistPopularityScore,
        genre_id: createArtistGenreId,
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

  // Delete artist
  const handleArtistDelete = async (artist_id) => {
    let artistId = artist_id;
    const response = await fetch(`http://localhost:5000/artists/${artistId}`, {
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

  const handleEditArtist = async (artist_id) => {
    let artistId = artist_id;
    let artistName = editArtistNameRef.current;
    let artistPopularityScore = editArtistPopularityScoreRef.current;
    let editArtistGenreId = editArtistGenreIdRef.current;
    const response = await fetch(`http://localhost:5000/artists/${artistId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodeToken().token}`,
      },
      body: JSON.stringify({
        name: artistName,
        popularity_score: artistPopularityScore,
        genre_id: editArtistGenreId,
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
            Edit Artists:
          </h3>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>Artist ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Popularity Score</Table.HeadCell>
              <Table.HeadCell>Genre ID</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Delete</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {artists && (
                <>
                  {artists.map((artist, index) => (
                    <Table.Row
                      key={artist.artist_id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {artist.artist_id}
                      </Table.Cell>
                      <Table.Cell>{artist.name}</Table.Cell>
                      <Table.Cell>{artist.popularity_score}</Table.Cell>
                      <Table.Cell>{artist.genre_id}</Table.Cell>
                      <>
                        <Table.Cell style={{ cursor: "pointer" }}>
                          <a
                            onClick={() => {
                              setArtistId(artist.artist_id);
                              setEditModal(true);
                            }}
                            className="font-medium text-yellow-400 hover:underline dark:text-yellow-300"
                          >
                            Edit
                          </a>

                          <Modal
                            key={artist.artist_id}
                            show={editModal}
                            size="md"
                            popup={true}
                            onClose={() => setEditModal(false)}
                          >
                            <Modal.Header />
                            <Modal.Body>
                              <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                  Edit Artist
                                </h3>
                                <div>
                                  <div className="mb-2 block">
                                    <Label
                                      htmlFor="edit_artist_name"
                                      value="Name"
                                    />
                                  </div>
                                  <TextInput
                                    id="edit_artist_name"
                                    placeholder={artist.name}
                                    required={true}
                                    onChange={(e) => {
                                      editArtistNameRef.current =
                                        e.target.value;
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="mb-2 block">
                                    <Label
                                      htmlFor="artist_popularity_score"
                                      value="Popularity Score"
                                    />
                                  </div>
                                  <TextInput
                                    id="artist_popularity_score"
                                    placeholder={artist.popularity_score}
                                    type="text"
                                    required={true}
                                    onChange={(e) => {
                                      editArtistPopularityScoreRef.current =
                                        e.target.value;
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="mb-2 block">
                                    <Label
                                      htmlFor="artist_genre_id"
                                      value="Genre ID"
                                    />
                                  </div>
                                  <TextInput
                                    id="artist_genre_id"
                                    type="text"
                                    placeholder="What's the ID of his genre?"
                                    required={true}
                                    onChange={(e) => {
                                      editArtistGenreIdRef.current =
                                        e.target.value;
                                    }}
                                  />
                                </div>
                                <div className="w-full">
                                  <Button
                                    onClick={() => handleEditArtist(artistId)}
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
                              setArtistId(artist.artist_id);
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
                                    Are you sure you want to delete this artist?
                                  </h3>
                                  <div className="flex justify-center gap-4">
                                    <Button
                                      color="failure"
                                      onClick={() =>
                                        handleArtistDelete(artistId)
                                      }
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
          onSubmit={handleArtistSubmit}
        >
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Add Artist:
          </h3>
          <div>
            <div className="mb-2 block">
              <Label
                style={{ color: "white" }}
                htmlFor="create_artist_name"
                value="Name"
              />
            </div>
            <TextInput
              id="create_artist_name"
              type="text"
              placeholder="ex: Tiesto"
              required={true}
              onChange={(e) => {
                setCreateArtistName(e.target.value);
              }}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                style={{ color: "white" }}
                htmlFor="artist_popularity_score"
                value="Popularity Score"
              />
            </div>
            <TextInput
              id="artist_popularity_score"
              type="text"
              placeholder="How popular is this artist?"
              required={true}
              onChange={(e) => {
                setCreateArtistPopularityScore(e.target.value);
              }}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                style={{ color: "white" }}
                htmlFor="artist_genre_id"
                value="Genre ID"
              />
            </div>
            <TextInput
              id="artist_genre_id"
              type="text"
              placeholder="What's the ID of his genre?"
              required={true}
              onChange={(e) => {
                setCreateArtistGenreId(e.target.value);
              }}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}
