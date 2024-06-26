import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signInFailure,
	signInStart,
	signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
	const { currentUser, loading, error } = useSelector((state) => state.user);
	const fileRef = useRef(null);
	const [file, setFile] = useState(undefined);
	const [filePercentage, setFilePercentage] = useState(0);
	const [fileError, setFileError] = useState(false);
	const [formData, setFormData] = useState({});
	const [updateSuccess, setUpdateSuccess] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file]);

	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePercentage(Math.round(progress));
			},
			// eslint-disable-next-line no-unused-vars
			(error) => {
				setFileError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setFormData({ ...formData, avatar: downloadURL });
				});
			}
		);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
			}

			dispatch(updateUserSuccess(data));
			setUpdateSuccess(true);
		} catch (error) {
			dispatch(updateUserFailure(error.message));
		}
	};

	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart());

			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: "DELETE",
			});

			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
			}

			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};

	const handleSignOut = async () => {
		try {
			dispatch(signInStart());

			const res = await fetch(`/api/auth/signout`);
			const data = await res.json();

			if (data.success === false) {
				dispatch(signInFailure(data.message));
				return;
			}

			dispatch(signOutUserSuccess(data));
		} catch (error) {
			dispatch(signInFailure(error.message));
		}
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-smibold text-center my-7">Profile</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					onChange={(e) => setFile(e.target.files[0])}
					type="file"
					ref={fileRef}
					hidden
					accept="image/*"
				/>
				<img
					onClick={() => fileRef.current.click()}
					src={formData.avatar || currentUser.avatar}
					alt="Profile image"
					className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
				></img>
				<p className="text-sm self-center">
					{fileError ? (
						<span className="text-red-700">Error! Image upload failed.</span>
					) : filePercentage > 0 && filePercentage < 100 ? (
						<span className="text-slate-700">
							{`Uploading ${filePercentage}%...`}
						</span>
					) : filePercentage === 100 ? (
						<span className="text-green-700">Image successfully uploaded</span>
					) : (
						""
					)}
				</p>
				<input
					onChange={handleChange}
					type="text"
					placeholder="Username"
					defaultValue={currentUser.username}
					className="border p-3 rounded-lg"
					id="username"
				/>
				<input
					onChange={handleChange}
					type="email"
					placeholder="Email"
					defaultValue={currentUser.email}
					className="border p-3 rounded-lg"
					id="email"
				/>
				<input
					onChange={handleChange}
					type="password"
					placeholder="Password"
					className="border p-3 rounded-lg"
					id="password"
				/>
				<button
					disabled={loading}
					className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
				>
					{loading ? "Loading..." : "Update"}
				</button>
				<Link
					to={"/create-listing"}
					className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
				>
					Create Listing
				</Link>
			</form>
			<div className="flex justify-between mt-3">
				<span
					onClick={handleDeleteUser}
					className="text-red-700 cursor-pointer"
				>
					Delete account
				</span>
				<span onClick={handleSignOut} className="text-red-700 cursor-pointer">
					Sign out
				</span>
			</div>

			<p className="text-red-700 mt-5">{error ? error : ""}</p>
			<p className="text-green-700 mt-5">
				{updateSuccess ? "User is updated successfully!" : ""}
			</p>
		</div>
	);
}
