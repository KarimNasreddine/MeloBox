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

export default function Genres() {
  const [refresh, setRefresh] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [genreId, setGenreId] = useState();

  const [genres, setGenres] = useState();

  const [createGenreName, setCreateGenreName] = useState("");
  const [createGenreDescription, setCreateGenreDescription] = useState("");

  const editGenreNameRef = useRef("");
  const editGenreDescriptionRef = useRef("");

  useEffect(() => {
    fetch("http://localhost:5000/allgenres") // fetch data from the API
      .then((response) => response.json()) // parse JSON data into JS object
      .then((data) => {
        setGenres(data); // set data in the state
        console.log(data);
      });
  }, [refresh]);

  const handleGenreSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();
    const response = await fetch("http://localhost:5000/genres/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodeToken().token}`,
      },
      body: JSON.stringify({
        name: createGenreName,
        description: createGenreDescription,
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

  // Delete genre
  const handleGenreDelete = async (genre_id) => {
    let genreId = genre_id;
    const response = await fetch(`http://localhost:5000/genres/${genreId}`, {
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

  const handleEditGenre = async (genre_id) => {
    let genreId = genre_id;
    let genreName = editGenreNameRef.current;
    let genreDescription = editGenreDescriptionRef.current;
    const response = await fetch(`http://localhost:5000/genres/${genreId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodeToken().token}`,
      },
      body: JSON.stringify({
        name: genreName,
        description: genreDescription,
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
            Edit Genres:
          </h3>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>Genre ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Delete</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {genres && (
                <>
                  {genres.map((genre) => (
                    <Table.Row
                      key={genre.genre_id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {genre.genre_id}
                      </Table.Cell>
                      <Table.Cell>{genre.genre}</Table.Cell>
                      <Table.Cell>{genre.description}</Table.Cell>
                      <>
                        <Table.Cell style={{ cursor: "pointer" }}>
                          <a
                            onClick={() => {
                              setGenreId(genre.genre_id);
                              setEditModal(true);
                            }}
                            className="font-medium text-yellow-400 hover:underline dark:text-yellow-300"
                          >
                            Edit
                          </a>

                          <Modal
                            key={genre.genre_id}
                            show={editModal}
                            size="md"
                            popup={true}
                            onClose={() => setEditModal(false)}
                          >
                            <Modal.Header />
                            <Modal.Body>
                              <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                  Edit Genre
                                </h3>
                                <div>
                                  <div className="mb-2 block">
                                    <Label
                                      htmlFor="edit_genre_name"
                                      value="Name"
                                    />
                                  </div>
                                  <TextInput
                                    id="edit_genre_name"
                                    placeholder={genre.genre}
                                    required={true}
                                    onChange={(e) => {
                                      editGenreNameRef.current = e.target.value;
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="mb-2 block">
                                    <Label
                                      htmlFor="genre_description"
                                      value="Description"
                                    />
                                  </div>
                                  <Textarea
                                    id="genre_description"
                                    placeholder={genre.description}
                                    cols={4}
                                    required={true}
                                    onChange={(e) => {
                                      editGenreDescriptionRef.current =
                                        e.target.value;
                                    }}
                                  />
                                </div>
                                <div className="w-full">
                                  <Button
                                    onClick={() => handleEditGenre(genreId)}
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
                              setGenreId(genre.genre_id);
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
                                    Are you sure you want to delete this genre?
                                  </h3>
                                  <div className="flex justify-center gap-4">
                                    <Button
                                      color="failure"
                                      onClick={() => handleGenreDelete(genreId)}
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
          onSubmit={handleGenreSubmit}
        >
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Add Genre:
          </h3>
          <div>
            <div className="mb-2 block">
              <Label
                style={{ color: "white" }}
                htmlFor="create_genre_name"
                value="Name"
              />
            </div>
            <TextInput
              id="create_genre_name"
              type="text"
              placeholder="ex: Dance"
              required={true}
              onChange={(e) => {
                setCreateGenreName(e.target.value);
              }}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                style={{ color: "white" }}
                htmlFor="genre_description"
                value="Description"
              />
            </div>
            <Textarea
              id="genre_description"
              placeholder="Describe this genre..."
              rows={4}
              required={true}
              onChange={(e) => {
                setCreateGenreDescription(e.target.value);
              }}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}
