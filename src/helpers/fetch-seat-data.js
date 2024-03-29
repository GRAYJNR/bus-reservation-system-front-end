const fetchSeatData = async (date, tripId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_MODULE_DOMAIN}/tickets/seat/${tripId}/${date}`
    );
    const result = response.json();
    return result;
  } catch (error) {
    console.error(error);
    return 'Something went wrong!';
  }
};

export default fetchSeatData;
