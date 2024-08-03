'use client';
import { firestore } from "../firebase";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { collection, query, getDocs, setDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function Pantry() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSearchOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };
  const handleSearchClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  };

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updatePantry();
  };

  useEffect(() => {
    updatePantry();
  }, []);

  useEffect(() => {
    const results = pantry.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(results);
  }, [search, pantry]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={2}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"right"}
        gap={2}
      >
        <Button
          variant="outlined"
          color="success"
          onClick={() => signOut({ callbackUrl: '/', redirect:true })}
        >
          Sign Out
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {selectedItem ? `Item: ${selectedItem.name}` : "Add Item"}
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            {selectedItem ? (
              <Typography variant="body1">
                Quantity: {selectedItem.quantity}
              </Typography>
            ) : (
              <>
                <TextField
                  id="outlined-basic"
                  label="Item"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    addItem(itemName);
                    setItemName("");
                    handleClose();
                  }}
                >
                  ADD
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Modal>
      <Box
        width="800px"
        height="50px"
        bgcolor={"#FAA317"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        border={"1px solid #333"}
        gap={9}
      >
        <Typography variant={"h5"} color={"white"} textAlign={"center"}>
          Pantry Items
        </Typography>
        <Button variant="contained" onClick={handleOpen} color="success">
          ADD
        </Button>
      </Box>
      <Box
        width="800px"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={2}
      >
        <TextField
          label="Search Item"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <Box border={"1px solid #333"}>
        <Stack width="800px" height="300px" spacing={2} overflow={"auto"}>
          {searchResults.map(({ name, quantity }) => {
            return (
              <Box
                key={name}
                width="100%"
                height="100px"
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bgcolor={"#f0f0f0"}
                paddingX={5}
                onClick={() => handleSearchOpen({ name, quantity })}
              >
                <Typography variant={"h7"} color={"#333"} textAlign={"center"}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={"h7"} color={"#333"} textAlign={"center"}>
                  Quantity: {quantity}
                </Typography>
                <IconButton variant="contained" onClick={() => addItem(name)} color="success">
                  <AddIcon />
                </IconButton>
                <IconButton variant="contained" onClick={() => removeItem(name)} color="success">
                  <RemoveIcon />
                </IconButton>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
