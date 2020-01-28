const MasonryChildrenStyles = {
  imageContainer: {
    boxShadow: "8px 5px 13px 0px rgba(lightskyblue, 0.17)",
    width: "100%",
    height: "auto",
    position: "relative",
    marginBottom: "14px",
    "& a": {
      display: "block",
      height: "auto"
    },
    "&:hover $imageDetails": {
      display: "block"
    }
  },
  imageDetails: {
    height: "100%",
    display: "none",
    width: "100%",
    top: "0",
    cursor: "pointer",
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  }
};

export default MasonryChildrenStyles;
