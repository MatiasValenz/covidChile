import React, { Fragment } from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

const CardCovid = ({ title, total, img }) => {
  return (
    <Fragment>
      <Card>
        <CardBody className="text-center">
          <CardTitle tag="h3">{title}</CardTitle>
          <CardSubtitle tag="h4" className="mb-2 ">
            {total}
          </CardSubtitle>
        </CardBody>
        <img
          src={img}
          alt=""
          className="mx-auto d-block"
          width="200"
          height="200"
        />
      </Card>
    </Fragment>
  );
};

export default CardCovid;
