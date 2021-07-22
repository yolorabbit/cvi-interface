import React, { useState, useEffect, useContext } from "react";
import ChartOptions from "./ChartOptions";
import { useRef } from "react";
import "./FundingFeesGraph.scss";
import { viewportContext } from "components/Context";
import { useSelector } from "react-redux";

const feesInfo = [
    [0, 10],
    [1, 10],
    [2, 10],
    [3, 10],
    [4, 10],
    [5, 10],
    [6, 10],
    [7, 10],
    [8, 10],
    [9, 10],
    [10, 10],
    [11, 10],
    [12, 10],
    [13, 10],
    [14, 10],
    [15, 10],
    [16, 10],
    [17, 10],
    [18, 10],
    [19, 10],
    [20, 10],
    [21, 10],
    [22, 10],
    [23, 10],
    [24, 10],
    [25, 10],
    [26, 10],
    [27, 10],
    [28, 10],
    [29, 10],
    [30, 10],
    [31, 10],
    [32, 10],
    [33, 10],
    [34, 10],
    [35, 10],
    [36, 10],
    [37, 10],
    [38, 10],
    [39, 10],
    [40, 10],
    [41, 10],
    [42, 10],
    [43, 10],
    [44, 10],
    [45, 10],
    [46, 10],
    [47, 10],
    [48, 10],
    [49, 10],
    [50, 10],
    [51, 10],
    [52, 10],
    [53, 10],
    [54, 10],
    [55, 10],
    [56, 9.06],
    [57, 8.12],
    [58, 7.18],
    [59, 6.24],
    [60, 5.3],
    [61, 4.8],
    [62, 4.3],
    [63, 3.8],
    [64, 3.3],
    [65, 2.8],
    [66, 2.55],
    [67, 2.3],
    [68, 2.05],
    [69, 1.8],
    [70, 1.55],
    [71, 1.43],
    [72, 1.3],
    [73, 1.18],
    [74, 1.05],
    [75, 0.93],
    [76, 0.87],
    [77, 0.8],
    [78, 0.74],
    [79, 0.67],
    [80, 0.61],
    [81, 0.58],
    [82, 0.55],
    [83, 0.52],
    [84, 0.49],
    [85, 0.46],
    [86, 0.44],
    [87, 0.42],
    [88, 0.41],
    [89, 0.39],
    [90, 0.38],
    [91, 0.37],
    [92, 0.36],
    [93, 0.36],
    [94, 0.35],
    [95, 0.34],
    [96, 0.34],
    [97, 0.33],
    [98, 0.33],
    [99, 0.32],
    [100, 0.32],
    [101, 0.32],
    [102, 0.32],
    [103, 0.31],
    [104, 0.31],
    [105, 0.31],
    [106, 0.31],
    [107, 0.31],
    [108, 0.3],
    [109, 0.3],
    [110, 0.3],
    [111, 0.3],
    [112, 0.3],
    [113, 0.3],
    [114, 0.3],
    [115, 0.3],
    [116, 0.3],
    [117, 0.3],
    [118, 0.3],
    [119, 0.3],
    [120, 0.3],
    [121, 0.3],
    [122, 0.3],
    [123, 0.3],
    [124, 0.3],
    [125, 0.3],
    [126, 0.3],
    [127, 0.3],
    [128, 0.3],
    [129, 0.3],
    [130, 0.3],
    [131, 0.3],
    [132, 0.3],
    [133, 0.3],
    [134, 0.3],
    [135, 0.3],
    [136, 0.3],
    [137, 0.3],
    [138, 0.3],
    [139, 0.3],
    [140, 0.3],
    [141, 0.3],
    [142, 0.3],
    [143, 0.3],
    [144, 0.3],
    [145, 0.3],
    [146, 0.3],
    [147, 0.3],
    [148, 0.3],
    [149, 0.3],
    [150, 0.3],
    [151, 0.3],
    [152, 0.3],
    [153, 0.3],
    [154, 0.3],
    [155, 0.3],
    [156, 0.3],
    [157, 0.3],
    [158, 0.3],
    [159, 0.3],
    [160, 0.3],
    [161, 0.3],
    [162, 0.3],
    [163, 0.3],
    [164, 0.3],
    [165, 0.3],
    [166, 0.3],
    [167, 0.3],
    [168, 0.3],
    [169, 0.3],
    [170, 0.3],
    [171, 0.3],
    [172, 0.3],
    [173, 0.3],
    [174, 0.3],
    [175, 0.3],
    [176, 0.3],
    [177, 0.3],
    [178, 0.3],
    [179, 0.3],
    [180, 0.3],
    [181, 0.3],
    [182, 0.3],
    [183, 0.3],
    [184, 0.3],
    [185, 0.3],
    [186, 0.3],
    [187, 0.3],
    [188, 0.3],
    [189, 0.3],
    [190, 0.3],
    [191, 0.3],
    [192, 0.3],
    [193, 0.3],
    [194, 0.3],
    [195, 0.3],
    [196, 0.3],
    [197, 0.3],
    [198, 0.3],
    [199, 0.3],
    [200, 0.3]
]

const chartInitialize = {
    id: "funding-fees-graph"
}

const FundingFeesGraph = ({ maxWidth = 350, maxHeight = 338 }) => {
    const { cviInfo } = useSelector(({ app }) => app.cviInfo);
    const cviValue = Math.floor(cviInfo?.price ?? 0);
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
        if (chart) {
            const { width, height } = getChartSize();
            chart.setSize(width > maxWidth ? maxWidth : width, height);
            chart.redraw();
        }
        //eslint-disable-next-line
    }, [windowWidth, chart]);

    useEffect(() => {
        if (!feesInfo) {
            return
        }
        setChart(null);
        setChart(ChartOptions({ chartInitialize, series: feesInfo, cviValue }));
        //eslint-disable-next-line
    }, [feesInfo, cviValue]);

    useEffect(() => {
        if (ref.current && ref.current?.children[0]?.style) {
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