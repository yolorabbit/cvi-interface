import React, { useState, useEffect, useContext } from "react";
import ChartOptions from "./ChartOptions";
import { useRef } from "react";
import { mappedSeriesData } from "shared/historicalData";
import { viewportContext } from "components/Context";
import "./CviIndexGraph.scss";
import { useSelector } from "react-redux";

const chartInitialize = {
    id: "vix-graph"
}

const CviIndexGraph = ({id, maxWidth = 700, maxHeight = 370}) => {
    const ref = useRef();
    const [chart, setChart] = useState();
    const { width: windowWidth } = useContext(viewportContext);
    const [activeRange, setActiveRange] = useState();
    const { series } = useSelector(({app}) => app.cviInfo);
    
    useEffect(() => {
        const getChartSize = () => {
            return window.innerWidth < 767 ? {
                width: maxWidth,
                height: maxHeight
            } : {
                width: maxWidth,
                height: maxHeight
            }
        } 

        if(chart) {
            const {width, height } = getChartSize();
            chart.setSize(width > maxWidth ? maxWidth : width, height);
            chart.redraw();
        }
        //eslint-disable-next-line
    }, [windowWidth, chart]);

    useEffect(()=> {
        setChart(ChartOptions({
            chartInitialize, 
            activeRange: activeRange, 
            series: (!series?.length || activeRange === "all") ? mappedSeriesData(series) : series, 
            onClick: (id) => {
                setActiveRange(id);
            }
        }));
        //eslint-disable-next-line
    },[series, activeRange]);

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

export default CviIndexGraph;