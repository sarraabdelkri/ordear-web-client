import { useEffect, useRef, useState } from "react";
import styles from "./Cart.module.css";
import { Toaster, toast } from "react-hot-toast";
import close from "../../assets/xmark-solid.svg";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/cartSlice";
import { AiOutlineShoppingCart } from "react-icons/ai";

const ConfirmProduct = (props) => {
  const dispatch = useDispatch();

  const [ingredients, setIngredients] = useState([]);
  const [items, setItems] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const buttonRef = useRef(null);

  const disableButton = () => {
    buttonRef.current.disabled = true;
  };

  const enableButton = () => {
    buttonRef.current.disabled = false;
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/cart/get/cartTrash/by/user`,
        {
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error("Le panier n'existe pas ");
      } else {
        dispatch(cartActions.setCart(responseData));
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

  const fetchIngredients = async (pro) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/ingredient/retrieve/disponible/ingredient/by/Product/${pro}`,
        {
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        setIngredients(responseData);
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

  const fetchItems = async (ing) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/item/retrieve/visible/item/by/ingredient/${ing}`,
        {
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        setItems(responseData);
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

  const AddToCart = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/cart/addProdductToCart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            restaurantFK: props.restaurantInfo.restaurantId,
            tableNb: props.restaurantInfo.tableNb,
            productFK: props.productInfo.id,
            ingredientFK: [selectedIngredient] || [],
            itemsFK: listItems.map((el) => items.find((e) => e._id == el)?._id),
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        enableButton();
        throw new Error(responseData.message || responseData.error);
      } else {
        toast.success("Cet élément est ajouté au panier", {
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
        setTimeout(() => {
          props.closeModal();
        }, 1000);
      }
    } catch (err) {
      console.log(err);
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

  const handleChange = (event) => {
    fetchItems(event.target.value);
    setSelectedIngredient(event.target.value);
  };

  const handleChangeItems = (event) => {
    setListItems(event.target.value);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    fetchIngredients(props.productInfo.id);
  }, []);

  return (
    <div className={styles.backdrop} onClick={props.closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.top}>
          <h4 className={styles.h1}>
            {props.productInfo.name} {props.productInfo.price}$
          </h4>

          <img src={close} alt="close" onClick={props.closeModal} />
        </div>
        <img
          src={props.productInfo.photo}
          alt="photo"
          className={styles.productImg}
        />
        <h3 className={styles.title}>Ingredients</h3>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Ingrédients</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            placeholder="Ingredients"
            label="Ingredients"
            onChange={handleChange}
            defaultValue=""
          >
            {ingredients.map((el) => (
              <MenuItem key={el._id} value={el._id}>
                {el.libelle}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {items.length > 0 && (
          <>
            <div className="mt-3">
              <h5 className={styles.title}>
                Les choix de cet ingrédient (choix multiple)
              </h5>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Choix</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  placeholder="Items"
                  label="Items"
                  multiple
                  value={listItems}
                  onChange={handleChangeItems}
                  defaultValue=""
                >
                  {items.map((el) => (
                    <MenuItem key={el._id} value={el._id}>
                      {el.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </>
        )}
        <button
          className={styles["button-3"]}
          ref={buttonRef}
          onClick={() => {
            disableButton();
            AddToCart();
          }}
        >
          <AiOutlineShoppingCart /> Ajouter au panier{" "}
        </button>
      </div>
    </div>
  );
};

export default ConfirmProduct;
