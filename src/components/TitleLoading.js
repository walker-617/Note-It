function TitleLoading() {
  const styles = {
    note: {
    //   opacity: 0.5,
    },
    title: {
      width: "100px",
      height: "5px",
      backgroundColor: "var(--main-color)",
      margin: "10px",
      borderRadius: "3px",
    },
    time: {
      width: "50px",
      height: "0px",
      backgroundColor: "var(--main-color)",
      margin: "5px",
      borderRadius: "3px",
    }
  };

  return (
    <div className="note" style={styles.note}>
      <div className="card-shine"></div>
      <span className="title-name" style={styles.title}></span>
      <span className="title-time" style={styles.time}></span>
    </div>
  );
}

export default TitleLoading;
