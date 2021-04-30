import React, { Fragment, useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import axios from "axios";
import Loading from "../components/Loading";
import CardCovid from "../components/CardCovid";

import acumulados from "../images/acumulados.png";
import activos from "../images/activos.png";
import fallecidos from "../images/fallecidos.png";
import recuperados from "../images/recuperados.png";

import Regiones from "../regiones";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regionSelect, setRegionSelect] = useState("");
  const [values, setValues] = useState({
    acumulados: 0,
    activos: 0,
    fallecidos: 0,
    recuperados: 0,
  });
  const [data, setData] = useState({
    total: {},
    regiones: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const respRegiones = await axios.get(
          "https://api.covid19api.com/live/country/chile/status/confirmed/date/" +
            MesActual()
        );

        const respTotal = await axios.get("https://api.covid19api.com/summary");

        var regiones = respRegiones.data.slice(respRegiones.data.length - 16);
        var total = respTotal.data["Countries"][34];

        setData({
          regiones: regiones,
          total: total,
        });

        setValues({
          acumulados: Formato(total.TotalConfirmed),
          activos: Formato(
            total.TotalConfirmed - total.TotalDeaths - total.TotalRecovered
          ),
          fallecidos: Formato(total.TotalDeaths),
          recuperados: Formato(total.TotalRecovered),
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const MesActual = () => {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    var fecha = date.getFullYear() + "-" + (date.getMonth() + 1);

    return fecha;
  };

  const Dia = () => {
    let options = {
      weekday: "long",
      //year: "numeric",
      month: "long",
      day: "numeric",
    };

    var date = new Date();
    return date.toLocaleDateString("es", options);
  };

  const Formato = (num) => {
    return num.toLocaleString("de-DE", {
      minimumFractionDigits: 0,
    });
  };

  const Filtrar = (e) => {
    var index = e.target.selectedIndex;
    var regSelect = e.target[index].text;

    //Nombre completo de la región
    setRegionSelect(regSelect);
    //Nombre de la región para comparar con la Api
    var regApi = e.target.value;

    if (regApi === "0") {
      setValues({
        acumulados: Formato(data.total.TotalConfirmed),
        fallecidos: Formato(data.total.TotalDeaths),
        recuperados: Formato(data.total.TotalRecovered),
        activos: Formato(
          data.total.TotalConfirmed -
            data.total.TotalDeaths -
            data.total.TotalRecovered
        ),
      });
    } else {
      let result = data.regiones.filter((reg) => {
        if (reg.Province === regApi) {
          return reg;
        }
        return false;
      });

      setValues({
        acumulados: Formato(result[0].Confirmed),
        fallecidos: Formato(result[0].Deaths),
        recuperados: Formato(result[0].Recovered),
        activos: Formato(result[0].Active),
      });
    }
  };

  if (error) {
    return <Fragment>{error}</Fragment>;
  }

  if (loading || !data) {
    return (
      <Container className="mt-3">
        <Row>
          <Col>
            <Loading />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Fragment>
      <Container className="mt-5">
        <Row>
          <Col xs="6" md="6" lg="6">
            <h3>Situación actual de Chile</h3>
            <h5>{regionSelect}</h5>
          </Col>
          <Col xs="6" md="6" lg="6" className="text-right">
            <h6>{Dia()}</h6>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <select className="form-select form-select-sm" onChange={Filtrar}>
              <option value="0">Nivel país</option>
              {Regiones.map((region, i) => {
                return (
                  <option value={region.nameApi} key={i}>
                    {region.name}
                  </option>
                );
              })}
            </select>
          </Col>
        </Row>
        <Row className="justify-content-center mt-5">
          <Col md="7" lg="4">
            <CardCovid
              title="Casos Acumulados"
              total={values.acumulados}
              img={acumulados}
            />
          </Col>
        </Row>
        <Row className=" justify-content-center text-center mt-3">
          <Col md="7" lg="4" className="mt-3">
            <CardCovid
              title="Casos Activos"
              total={values.activos}
              img={activos}
            />
          </Col>
          <Col md="7" lg="4" className="mt-3">
            <CardCovid
              title="Fallecidos"
              total={values.fallecidos}
              img={fallecidos}
            />
          </Col>
          <Col md="7" lg="4" className="mt-3">
            <CardCovid
              title="Recuperados"
              total={values.recuperados}
              img={recuperados}
            />
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Home;
