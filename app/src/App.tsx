import Widget from "./components/global/widget";
import ControlledLayout from "./layout/controlledLayout";
function App() {
  return (
    <>
      {/* <div className="flex justify-center p-1 w-full"> */}
        <ControlledLayout>
          <Widget />
        </ControlledLayout>
      {/* </div> */}
    </>
  );
}

export default App;
