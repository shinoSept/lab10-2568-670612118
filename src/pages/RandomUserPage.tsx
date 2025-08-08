import { UserCard } from "../components/UserCard";
import { cleanUser } from "../libs/CleanUser";
import axios from "axios";
import { useEffect, useState } from "react";
export default function RandomUserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1);
  const [users, setUsers] = useState<any>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const genAmt = localStorage.getItem("genAmount");
    if (genAmt === null) { return; }
    const strGenAmount = JSON.parse(genAmt);
    setGenAmount(strGenAmount);
  }, []);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    const strGenAmount = JSON.stringify(genAmount);
    localStorage.setItem("genAmount", strGenAmount);
  }, [genAmount]);

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;
    //Your code here
    //Process result from api response with map function. Tips use function from /src/libs/CleanUser
    //Then update state with function : setUsers(...)
    const cleanUsers = users.map((user: any) => cleanUser(user));
    setUsers(cleanUsers);
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(event: any) => setGenAmount(event.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users && !isLoading && users.map((user: any) => <UserCard name={user.name} imgUrl={user.imgUrl} address={user.address} email={user.email} />)}
    </div>
  );
}
