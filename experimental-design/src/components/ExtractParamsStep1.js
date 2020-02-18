import React from 'react';
import { BrowserRouter as Router, Route, Switch, useParams, Link } from 'react-router-dom';
import ExtractParamsStep2 from './ExtractParamsStep2'

export default function ExtractParamsStep1(props) {
    let { id } = useParams();
    return (<ExtractParamsStep2 updateReceivedParams={props.updateReceivedParams} paramsToBeExtracted={id} />);
}