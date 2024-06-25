import { useState, useEffect } from "react";
import avatar from "../../assets/avatar.png";
import styles from "./Profile.module.css";
import { Toaster, toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import EditPassword from "./EditPassword";
import AllergiesModal from './AllergiesModal'; // Import the correct component
import Navs from "../Navs/Navs";
import Footer from "../Footer/Footer";
import { AiOutlineUser, AiOutlineLock ,AiOutlineCamera  } from "react-icons/ai";
import backgroundImage from '../../assets/full-bg.png';
import { MdLock, MdPhone, MdEmail, MdCake, MdLocationOn, MdPerson , MdEdit, MdNotifications, MdExitToApp } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const [showModal, setShowModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const isGoogleAuth = useSelector((state) => state.auth.isGoogleAuthenticated);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }

      const url = `${process.env.REACT_APP_BACKEND_URL}/user/getById/${userId}`;

      const response = await fetch(url, {
        credentials: "include",
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        const { firstName, lastName, email, role, createdAt, updatedAt, phone, birthday, address, image } = responseData;
        setProfile({ firstName, lastName, email, role, createdAt, updatedAt, phone, birthday, address, image });
        if (image) {
          setImageURL(`${process.env.REACT_APP_BACKEND_URL}/user/getImageByUserId/${userId}`);
        }
      }
    } catch (err) {
      toast.error(err.message, {
        style: { border: "1px solid #FA8072", padding: "16px", color: "#FA8072" },
        iconTheme: { primary: "#FA8072", secondary: "#f88f8f" },
      });
    }
  };

  useEffect(() => {
    if (isAuth || isGoogleAuth) fetchProfile();
  }, [showModal]);

  const handleUploadImage = async (event) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }

      const formData = new FormData();
      formData.append("image", event.target.files[0]);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/updateUserImage/${userId}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        setImageURL(responseData.imageUrl);
        toast.success("Image updated successfully", {
          style: {
            border: "1px solid #FA8072",
            padding: "16px",
            color: "#FA8072",
          },
          iconTheme: {
            primary: "#FA8072",
            secondary: "#f88f8f",
          },
        });
      }
    } catch (err) {
      toast.error(err.message, {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#f88f8f",
        },
      });
    }
  };

  const getImage = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }

      const url = `${process.env.REACT_APP_BACKEND_URL}/user/getImageByUserId/${userId}`;

      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        const responseData = await response.json();
        throw new Error(responseData.message || responseData.error);
      } else {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageURL(imageUrl);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  useEffect(() => {
    if (isAuth) getImage();
  }, [handleUploadImage]);

  const formatNumber = (number) => {
    return number < 10 ? `0${number}` : `${number}`;
  };

  return (
    <>
      <Navs />
      <section style={{ backgroundColor:"white", minHeight: "100vh", padding: "20px",marginTop:"60px" }}>
      
        <div>
          <Toaster />
        </div>
        {isAuth ? (
          <div>
            <div className="overflow-hidden">
              <div className="row no-gutters row-bordered row-border-light">
                <div className="col-md-3 pt-0" style={{ color: "black", marginTop: "20px" }}>
                  <h4 className="font-weight-bold py-3 mb-4" style={{ color: "black", marginTop: "5px", marginLeft: "20px" }}>
                    Account Profile
                  </h4>
                  <div>
                    <div className={styles.sidebaritem} style={{ color: "black", marginTop: "30px", marginLeft: "30px" }}>
                      <MdPerson className={styles.icons} />
                      <a data-toggle="list" style={{ color: "black" }}>General</a>
                    </div>
                    <div style={{ color: "black", marginTop: "40px", marginLeft: "30px" }}>
                      <MdEdit className={styles.icon} />
                      <a data-toggle="list" style={{ color: "#babbbc" }} onClick={() => setShowModal(true)}>Modifier Profile</a>
                    </div>
                    <div style={{ color: "black", marginTop: "40px", marginLeft: "30px" }}>
                      <MdLock className={styles.icon} />
                      <a data-toggle="list" style={{ color: "#babbbc" }} onClick={() => setShowSecondModal(true)}>Change password</a>
                    </div>
                    <div style={{ color: "black", marginTop: "40px", marginLeft: "30px" }}>
                      <MdNotifications className={styles.icon} />
                      <a data-toggle="list" style={{ color: "#babbbc" }} href="#account-notifications">Notifications</a>
                    </div>
                  </div>
                  <div style={{ color: "black", marginTop: "200px", marginLeft: "30px" }}>
                    <MdExitToApp className={styles.icon} style={{ color: "black", color: "#FA8072" }} />
                    <a data-toggle="list" style={{ color: "black", color: "#FA8072" }} href="#account-connections">Log out</a>
                  </div>
                </div>
                <div className="col-md-9" style={{ marginTop: "50px" }}>
                  <div className={styles.avatarContainer} style={{ color: "black", marginTop: "5px", marginLeft: "30px", display: "flex", alignItems: "center" }}>
                    <label htmlFor="avatar">
                      <div className={styles.imageContainer}>
                        <img src={imageURL || avatar} alt="avatar" className={styles.imageURL} />
                      </div>
                    </label>
                    <div style={{ marginLeft: "10px", fontWeight: "bolder" }}>{profile.firstName} {profile.lastName}</div>
                    <div style={{ marginTop: "80px", fontWeight: "lighter", marginLeft: "-80px" }}>
                      {profile.address}
                    </div>
                    <div className={styles.cameraIconContainer}>
                      <label htmlFor="avatar">
                        <AiOutlineCamera className={styles.cameraIcon} />
                      </label>
                    </div>
                    <input
                      id="avatar"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleUploadImage}
                    />
                  </div>
                  <div className="tab-content text-center">
                    <div className="tab-pane fade active show" id="account-general">
                      <hr className="border-light m-0" />
                      <div className="card-body">
                        <div className="py-2">
                          <div className="row py-2">
                            <div className="col-md-5 offset-md-1">
                              <div className="form-group">
                                <MdPerson className={styles.infoIcon} style={{ textAlign: "right" }} />
                                <label style={{ textAlign: "right" }}>Nom :</label>
                                <div className={styles.infoItem}>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profile.firstName}
                                    readOnly
                                    style={{ backgroundColor: "white", textAlign: "center", marginRight: "30px" }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-5">
                              <div className="form-group">
                                <MdPerson className={styles.infoIcon} />
                                <label>Prénom :</label>
                                <div className={styles.infoItem}>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profile.lastName}
                                    readOnly
                                    style={{ backgroundColor: "white", textAlign: "center" }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row py-2">
                              <div className="col-md-5 offset-md-1">
                                <div className="form-group">
                                  <MdEmail className={styles.infoIcon} />
                                  <label>Adresse e-mail :</label>
                                  <div className={styles.infoItem}>
                                    <input
                                      type="email"
                                      className="form-control"
                                      value={profile.email}
                                      readOnly
                                      style={{ backgroundColor: "white", textAlign: "center" }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-5">
                                <div className="form-group">
                                  <MdPhone className={styles.infoIcon} />
                                  <label>Téléphone :</label>
                                  <div className={styles.infoItem}>
                                    <input
                                      type="tel"
                                      className="form-control"
                                      value={profile.phone}
                                      readOnly
                                      style={{ backgroundColor: "white", textAlign: "center" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row py-2">
                              <div className="col-md-5 offset-md-1">
                                <div className="form-group">
                                  <MdCake className={styles.infoIcon} />
                                  <label>Date de naissance :</label>
                                  <div className={styles.infoItem} style={{ display: "flex", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={formatNumber(new Date(profile.birthday).getDate())}
                                      readOnly
                                      style={{ backgroundColor: "white", textAlign: "center", marginRight: "10px" }}
                                    />
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={formatNumber(new Date(profile.birthday).getMonth() + 1)}
                                      readOnly
                                      style={{ backgroundColor: "white", textAlign: "center", marginRight: "10px" }}
                                    />
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={new Date(profile.birthday).getFullYear()}
                                      readOnly
                                      style={{ backgroundColor: "white", textAlign: "center" }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-5">
                                <div className="form-group">
                                  <MdLock className={styles.infoIcon} />
                                  <label style={{ textAlign: "center" }}>Membre depuis :</label>
                                  <div className={styles.infoItem} style={{ display: "flex", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={formatNumber(new Date(profile.createdAt).getDate())}
                                      readOnly
                                      style={{ backgroundColor: "white", textAlign: "center", marginRight: "10px" }}
                                    />
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={formatNumber(new Date(profile.createdAt).getMonth() + 1)}
                                      readOnly
                                      style={{ backgroundColor: "white", textAlign: "center", marginRight: "10px" }}
                                    />
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={new Date(profile.createdAt).getFullYear()}
                                      readOnly
                                      style={{ backgroundColor: "white", textAlign: "center" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row py-2">
                              <div className="col-md-5 offset-md-3">
                                <div className="form-group">
                                  <MdLocationOn className={styles.infoIcon} />
                                  <label>Location :</label>
                                  <div className={styles.infoItem} style={{ display: "flex", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={profile.address}
                                      readOnly
                                      style={{ backgroundColor: "white", textAlign: "center", marginRight: "10px" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h1 className={styles.title}>you're not authorized, sign in before</h1>
        )}
        {showModal && (
          <EditProfile closeModal={() => setShowModal(false)} profile={profile} />
        )}
        {showSecondModal && (
          <EditPassword closeModal={() => setShowSecondModal(false)} />
        )}
      </section>
      <Footer />
    </>
  );
};

export default Profile;
