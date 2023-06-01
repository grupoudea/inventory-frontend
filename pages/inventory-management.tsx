import React from "react";
import { useEffect, useState } from "react";
import { Column } from "@/utils/utils";
import Layout from "@/layouts/Layout";
import { useNavigationContext } from "@/context/NavigationContext";
import {
  InventoryContextProvider,
  useInventoryContext,
} from "@/context/InventoryContext";
import { NextPage } from "next";
import Head from "next/head";
import { FormDialogAddMovement } from "@/components/dialog/FormDialogAddMovement";
import TableReactDataGrid from "@/components/TableReactDataGrid";
import PrivateRoute from "@/components/PrivateRoute";
import { useQuery } from "@apollo/client";
import { GET_MOVEMENTS } from "@/graphql/client/movement_client";
import { GET_MATERIALS } from "@/graphql/client/material_client";

const InventoryPage: NextPage = () => (
  <PrivateRoute>
    <Head>
      <title>Inventory</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <InventoryContextProvider>
        <div className="flex flex-col h-full w-full">
          <InventoryManagement />
        </div>
      </InventoryContextProvider>
    </Layout>
  </PrivateRoute>
);

const InventoryManagement = () => {
  const [materialSelected, setMaterialSelected] = useState<number>(0);
  const { setTituloHeader } = useNavigationContext();

  useEffect(() => {
    setTituloHeader("Gestión de inventarios");
  }, []);

  return (
    <div className="flex w-full flex-col h-full px-5">
      <div className="flex justify-between">
        <InputSearchMovement
          materialSelected={materialSelected}
          setMaterialSelected={setMaterialSelected}
        />
        <ButtonAddMovement materialSelected={materialSelected} />
      </div>
      <InventoryTable materialSelected={materialSelected}></InventoryTable>

      <FormDialogAddMovement materialSelected={materialSelected} />
    </div>
  );
};

const InventoryTable = ({ materialSelected }: { materialSelected: number }) => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [cantidadDisponible, setCantidaddisponible] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const { data } = useQuery<{ movements: any[] }>(GET_MOVEMENTS, {
    fetchPolicy: "cache-first",
    variables: { idMaterial: materialSelected },
  });
  useEffect(() => {
    if (materialSelected) {
      if (data && data.movements) {
        let datos: any[] = [];

        let cantidad = 0;
        data.movements.forEach((nDato: any) => {
          const dato = { ...nDato };
          if (nDato.movement_type === "ENTRADA") {
            dato.entradas = nDato.quantity;
            cantidad += nDato.quantity;
          }
          if (dato.movement_type === "SALIDA") {
            dato.salidas = nDato.quantity;
            cantidad -= nDato.quantity;
          }
          datos.push(dato);
        });

        setLoading(false);
        setDataSource(datos);
        setCantidaddisponible(cantidad);
      } else {
        setLoading(true);
      }
    } else {
      setLoading(true);
    }
  }, [data, materialSelected]);

  if (loading) return <div>Selecciona un material</div>;

  const columns: Column[] = [];
  columns.push({ name: "id", header: "Identificador" });
  columns.push({ name: "creation_date", header: "Fecha del movimiento" });
  columns.push({ name: "entradas", header: "Entradas" });
  columns.push({ name: "salidas", header: "Salidas" });

  return (
    <>
      <TableReactDataGrid dataSource={dataSource} columns={columns} />
      <div className="flex justify-end pr-0 mt-5 text-lg mb-24">
        Cantidad disponible: {cantidadDisponible}
      </div>
    </>
  );
};

const ButtonAddMovement = ({
  materialSelected,
}: {
  materialSelected: number;
}) => {
  const { setOpenDialogMovements } = useInventoryContext();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (materialSelected === 0) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [materialSelected]);

  return (
    <div className="flex my-5 justify-end">
      <button
        type="button"
        disabled={isButtonDisabled}
        onClick={() => setOpenDialogMovements(true)}
      >
        Agregar movimiento
      </button>
    </div>
  );
};

const InputSearchMovement = ({
  materialSelected,
  setMaterialSelected,
}: {
  materialSelected: number;
  setMaterialSelected: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const handleMaterialChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setMaterialSelected(parseInt(event.target.value, 10));
  };

  const { data } = useQuery<{ materials: any[] }>(GET_MATERIALS, {
    fetchPolicy: "cache-first",
  });

  let materiales: any[] = data?.materials || [];

  return (
    <div className="flex my-5">
      <select
        required
        value={materialSelected}
        name="material"
        onChange={handleMaterialChange}
      >
        <option key={0} value={0}>
          {"Seleccione un material"}
        </option>
        {materiales?.map((material) => (
          <option key={`material_${material.id}`} value={material.id}>
            {material.name}
          </option>
        ))}
      </select>
    </div>
  );
};
export default InventoryPage;
