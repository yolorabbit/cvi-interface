import React, { useState, useEffect, useContext } from "react";
import ChartOptions from "./ChartOptions";
import { useRef } from "react";
import "./FundingFeesGraph.scss";
import { viewportContext } from "components/Context";

const chartInitialize = {
    id: "funding-fees-graph"
}

const FundingFeesGraph = ({series, cviValue, maxWidth = 350, maxHeight = 338}) => {
    cviValue = Math.floor(cviValue ?? 0);
    const ref = useRef();
    const [chart, setChart] = useState();
    const { windowWidth } = useContext(viewportContext);

    const getChartSize = () => {
        return window.innerWidth < 767 ? {
            width: maxWidth,
            height: maxHeight
        } : {
            width: maxWidth,
            height: maxHeight
        }
    } 

    useEffect(() => {
        if(chart) {
            const {width, height } = getChartSize();
            chart.setSize(width > maxWidth ? maxWidth : width, height);
            chart.redraw();
        }
        //eslint-disable-next-line
    }, [windowWidth, chart]);

    useEffect(()=> {
        if(!series) {
            return
        }
        setChart(null);
        setChart(ChartOptions({ chartInitialize, series, cviValue }));
        //eslint-disable-next-line
    },[series, cviValue]);

    useEffect(() => {
        if(ref.current && ref.current?.children[0]?.style) {
            ref.current.style.overflow = "";
            ref.current.children[0].style.overflow = "";
        }
        //eslint-disable-next-line
    }, [chart]);

    return (
        <div ref={ref} id={chartInitialize.id}></div>
    );
};

export default FundingFeesGraph;