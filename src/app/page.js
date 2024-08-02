"use client";
import { Inter } from "next/font/google";
import Box from "@mui/material/Box";
import Link from "next/link";
import Button from "@mui/material/Button";

export default function Home() {
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
        component="img"
        sx={{
          height: 500,
          width: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        alt="Pantry flow logo."
        src="/PFMain.png"
      />
      <Box>
          <Link href="/signin" passHref>
            <Button variant="contained" color="success" fullWidth>
              Sign Up  /  Sign In
            </Button>
          </Link>

      </Box>
    </Box>
  );
}
