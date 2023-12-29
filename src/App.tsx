import React, { useContext, useState } from "react";
import "./App.css";

class View {
  input = TextInput;
}

interface Color {
  paramId: number;
  value: string;
}

enum ParamType {
  String = "string",
  Number = "number",
  Select = "select",
}

interface Param {
  id: number;
  name: string;
  type: ParamType;
}
interface ParamValue {
  paramId: number;
  value: string;
}
interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}
interface Props {
  params: Param[];
  model?: Model;
  view: View;
}

type handleChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  modelElement: ParamValue
) => void;

const initialModel = {
  paramValues: [
    { paramId: 2, value: "Макси" },
    { paramId: 1, value: "Повседневное" },
  ],
  colors: [
    { paramId: 1, value: "red" },
    { paramId: 2, value: "green" },
    { paramId: 3, value: "blue" },
  ],
};

const ModelContext = React.createContext({
  model: initialModel,
  setModel: (model: Model) => {},
});

function ParamEditor({ params, view }: Props) {
  const { model, setModel } = useContext(ModelContext);

  const getModel = (): Model => {
    console.log("model", model);
    return model;
  };

  const updateModel = (
    e: React.ChangeEvent<HTMLInputElement>,
    modelElement: ParamValue
  ) => {
    const newparamValues = model.paramValues.map((el) => {
      if (modelElement.paramId === el.paramId) {
        return {
          paramId: el.paramId,
          value: e.target.value,
        };
      }
      return el;
    });
    const newModel = { ...model, paramValues: newparamValues };
    setModel(newModel);
  };

  const onInputChange: handleChange = (e, modelElement) => {
    updateModel(e, modelElement);
  };

  return (
    <div className="params-list">
      {params.map((param) => {
        const modelElement = model.paramValues.find(
          (el) => el.paramId === param.id
        ) as ParamValue;
        return (
          <div key={param.id} className="params-list__item param-item">
            <label className="param-item__label" htmlFor={`${param.id}`}>
              {param.name}
            </label>
            <view.input
              customClass="param-item__input"
              param={param}
              modelElement={modelElement}
              onInputChange={onInputChange}
            />
          </div>
        );
      })}
    </div>
  );
}
const TextInput = ({
  param,
  modelElement,
  onInputChange,
  customClass,
}: {
  param: Param;
  modelElement: ParamValue;
  onInputChange: handleChange;
  customClass?: string;
}) => {
  return (
    <input
      type="text"
      className={`input-text ${customClass}`}
      id={`${param.id}`}
      value={modelElement?.value}
      onChange={(ev) => onInputChange(ev, modelElement)}
    />
  );
};

export default function App() {
  const [model, setModel] = useState(initialModel);
  const [view] = useState(new View());

  const value = { model, setModel };
  const params = [
    { id: 1, name: "Назначение", type: ParamType.String },
    { id: 2, name: "Длина", type: ParamType.String },
  ];
  return (
    <div className="App">
      <ModelContext.Provider value={value}>
        <ParamEditor view={view} params={params} />
      </ModelContext.Provider>
    </div>
  );
}
