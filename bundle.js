(function (React$1, ReactDOM, d3) {
  'use strict';

  var React$1__default = 'default' in React$1 ? React$1['default'] : React$1;
  ReactDOM = ReactDOM && Object.prototype.hasOwnProperty.call(ReactDOM, 'default') ? ReactDOM['default'] : ReactDOM;

  const csvUrl =
    'https://raw.githubusercontent.com/dataprofessor/data/master/penguins_cleaned.csv';
  // "species","island","bill_length_mm","bill_depth_mm","flipper_length_mm","body_mass_g","sex"
  const useData = () => {
    const [data, setData] = React$1.useState(null);

    React$1.useEffect(() => {
      const row = d => {
        //Converting string into number of following Column
        d.bill_length_mm = +d.bill_length_mm;
        d.bill_depth_mm = +d.bill_depth_mm;
        d.flipper_length_mm = +d.flipper_length_mm;
        d.body_mass_g = +d.body_mass_g;
        return d;
      };
      d3.csv(csvUrl, row).then(setData);
    }, []);
    
    return data;
  };

  const AxisBottom = ({ xScale, innerHeight, tickFormat, tickOffset = 3 }) =>
    xScale.ticks().map(tickValue => (
      React.createElement( 'g', {
        className: "tick", key: tickValue, transform: `translate(${xScale(tickValue)},0)` },
        React.createElement( 'line', { y2: innerHeight }),
        React.createElement( 'text', { style: { textAnchor: 'middle' }, dy: ".71em", y: innerHeight + tickOffset },
          tickFormat(tickValue)
        )
      )
    ));

  const AxisLeft = ({ yScale, innerWidth, tickOffset = 3 }) =>
    yScale.ticks().map(tickValue => (
      React.createElement( 'g', { className: "tick", transform: `translate(0,${yScale(tickValue)})` },
        React.createElement( 'line', { x2: innerWidth }),
        React.createElement( 'text', {
          key: tickValue, style: { textAnchor: 'end' }, x: -tickOffset, dy: ".32em" },
          tickValue
        )
      )
    ));

  const Marks = ({
    data,
    xScale,
    xValue,
    yScale,
    yValue,
    colorScale,
    colorValue,
    tooltipFormat,
    circleRadius
  }) =>
    data.map(d => (
      React.createElement( 'circle', {
        className: "mark", cx: xScale(xValue(d)), cy: yScale(yValue(d)), fill: colorScale(colorValue(d)), r: circleRadius },
        React.createElement( 'title', null, tooltipFormat(xValue(d)) )
      )
    ));

  const ColorLegend = ({
    colorScale,
    tickSpacing = 20,
    tickSize = 10,
    tickTextOffset = 20,
    onHover,
    hoveredValue,
    fadeOpacity
  }) =>
    colorScale.domain().map((domainValue, i) => (
      React.createElement( 'g', {
        className: "tick", transform: `translate(0,${i * tickSpacing})`, onMouseEnter: () => {
          onHover(domainValue);
        }, onMouseOut: () => {
          onHover(null);
        }, opacity: hoveredValue && domainValue !== hoveredValue ? fadeOpacity : 1 },
        React.createElement( 'circle', { fill: colorScale(domainValue), r: tickSize }),
        React.createElement( 'text', { x: tickTextOffset, dy: ".32em" },
          domainValue
        )
      )
    ));

  const width = 960;
  const height = 500;
  const margin = { top: 20, right: 200, bottom: 65, left: 90 };
  const xAxisLabelOffset = 50;
  const yAxisLabelOffset = 45;
  const fadeOpacity = 0.2;

  const App = () => {
    const data = useData();
    const [hoveredValue, setHoveredValue] = React$1.useState(null);

    if (!data) {
      return React$1__default.createElement( 'pre', null, "Loading..." );
    }

    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const xValue = d => d.bill_length_mm;
    const xAxisLabel = 'Bil Length';

    const yValue = d => d.bill_depth_mm;
    const yAxisLabel = 'Bill Depth';

    const colorValue = d => d.species;
    const colorLegendLabel = 'Species';

    const filteredData = data.filter(d => hoveredValue === colorValue(d));

    const circleRadius = 7;

    const siFormat = d3.format('.2s');
    const xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B');

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([0, innerHeight]);

    const colorScale = d3.scaleOrdinal()
      .domain(data.map(colorValue))
      .range(['#E6842A', '#137B80', '#8E6C8A']);

    return (
      React$1__default.createElement( 'svg', { width: width, height: height },
        React$1__default.createElement( 'g', { transform: `translate(${margin.left},${margin.top})` },
          React$1__default.createElement( AxisBottom, {
            xScale: xScale, innerHeight: innerHeight, tickFormat: xAxisTickFormat, tickOffset: 5 }),
          React$1__default.createElement( 'text', {
            className: "axis-label", textAnchor: "middle", transform: `translate(${-yAxisLabelOffset},${innerHeight /
            2}) rotate(-90)` },
            yAxisLabel
          ),
          React$1__default.createElement( AxisLeft, { yScale: yScale, innerWidth: innerWidth, tickOffset: 5 }),
          React$1__default.createElement( 'text', {
            className: "axis-label", x: innerWidth / 2, y: innerHeight + xAxisLabelOffset, textAnchor: "middle" },
            xAxisLabel
          ),
          React$1__default.createElement( 'g', { transform: `translate(${innerWidth + 60}, 60)` },
            React$1__default.createElement( 'text', { x: 35, y: -25, className: "axis-label", textAnchor: "middle" },
              colorLegendLabel
            ),
            React$1__default.createElement( ColorLegend, {
              tickSpacing: 22, tickSize: 10, tickTextOffset: 12, tickSize: circleRadius, colorScale: colorScale, onHover: setHoveredValue, hoveredValue: hoveredValue, fadeOpacity: fadeOpacity })
          ),
          React$1__default.createElement( 'g', { opacity: hoveredValue ? fadeOpacity : 1 },
            React$1__default.createElement( Marks, {
              data: data, xScale: xScale, xValue: xValue, yScale: yScale, yValue: yValue, colorScale: colorScale, colorValue: colorValue, tooltipFormat: xAxisTickFormat, circleRadius: circleRadius })
          ),
          React$1__default.createElement( Marks, {
            data: filteredData, xScale: xScale, xValue: xValue, yScale: yScale, yValue: yValue, colorScale: colorScale, colorValue: colorValue, tooltipFormat: xAxisTickFormat, circleRadius: circleRadius })
        )
      )
    );
  };
  const rootElement = document.getElementById('root');
  ReactDOM.render(React$1__default.createElement( App, null ), rootElement);

}(React, ReactDOM, d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbInVzZURhdGEuanMiLCJBeGlzQm90dG9tLmpzIiwiQXhpc0xlZnQuanMiLCJNYXJrcy5qcyIsIkNvbG9yTGVnZW5kLmpzIiwiaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjc3YgfSBmcm9tICdkMyc7XG5cbmNvbnN0IGNzdlVybCA9XG4gICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZGF0YXByb2Zlc3Nvci9kYXRhL21hc3Rlci9wZW5ndWluc19jbGVhbmVkLmNzdic7XG4vLyBcInNwZWNpZXNcIixcImlzbGFuZFwiLFwiYmlsbF9sZW5ndGhfbW1cIixcImJpbGxfZGVwdGhfbW1cIixcImZsaXBwZXJfbGVuZ3RoX21tXCIsXCJib2R5X21hc3NfZ1wiLFwic2V4XCJcbmV4cG9ydCBjb25zdCB1c2VEYXRhID0gKCkgPT4ge1xuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZShudWxsKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHJvdyA9IGQgPT4ge1xuICAgICAgLy9Db252ZXJ0aW5nIHN0cmluZyBpbnRvIG51bWJlciBvZiBmb2xsb3dpbmcgQ29sdW1uXG4gICAgICBkLmJpbGxfbGVuZ3RoX21tID0gK2QuYmlsbF9sZW5ndGhfbW07XG4gICAgICBkLmJpbGxfZGVwdGhfbW0gPSArZC5iaWxsX2RlcHRoX21tO1xuICAgICAgZC5mbGlwcGVyX2xlbmd0aF9tbSA9ICtkLmZsaXBwZXJfbGVuZ3RoX21tO1xuICAgICAgZC5ib2R5X21hc3NfZyA9ICtkLmJvZHlfbWFzc19nO1xuICAgICAgcmV0dXJuIGQ7XG4gICAgfTtcbiAgICBjc3YoY3N2VXJsLCByb3cpLnRoZW4oc2V0RGF0YSk7XG4gIH0sIFtdKTtcbiAgXG4gIHJldHVybiBkYXRhO1xufTsiLCJleHBvcnQgY29uc3QgQXhpc0JvdHRvbSA9ICh7IHhTY2FsZSwgaW5uZXJIZWlnaHQsIHRpY2tGb3JtYXQsIHRpY2tPZmZzZXQgPSAzIH0pID0+XG4gIHhTY2FsZS50aWNrcygpLm1hcCh0aWNrVmFsdWUgPT4gKFxuICAgIDxnXG4gICAgICBjbGFzc05hbWU9XCJ0aWNrXCJcbiAgICAgIGtleT17dGlja1ZhbHVlfVxuICAgICAgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7eFNjYWxlKHRpY2tWYWx1ZSl9LDApYH1cbiAgICA+XG4gICAgICA8bGluZSB5Mj17aW5uZXJIZWlnaHR9IC8+XG4gICAgICA8dGV4dCBzdHlsZT17eyB0ZXh0QW5jaG9yOiAnbWlkZGxlJyB9fSBkeT1cIi43MWVtXCIgeT17aW5uZXJIZWlnaHQgKyB0aWNrT2Zmc2V0fT5cbiAgICAgICAge3RpY2tGb3JtYXQodGlja1ZhbHVlKX1cbiAgICAgIDwvdGV4dD5cbiAgICA8L2c+XG4gICkpO1xuIiwiZXhwb3J0IGNvbnN0IEF4aXNMZWZ0ID0gKHsgeVNjYWxlLCBpbm5lcldpZHRoLCB0aWNrT2Zmc2V0ID0gMyB9KSA9PlxuICB5U2NhbGUudGlja3MoKS5tYXAodGlja1ZhbHVlID0+IChcbiAgICA8ZyBjbGFzc05hbWU9XCJ0aWNrXCIgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKDAsJHt5U2NhbGUodGlja1ZhbHVlKX0pYH0+XG4gICAgICA8bGluZSB4Mj17aW5uZXJXaWR0aH0gLz5cbiAgICAgIDx0ZXh0XG4gICAgICAgIGtleT17dGlja1ZhbHVlfVxuICAgICAgICBzdHlsZT17eyB0ZXh0QW5jaG9yOiAnZW5kJyB9fVxuICAgICAgICB4PXstdGlja09mZnNldH1cbiAgICAgICAgZHk9XCIuMzJlbVwiXG4gICAgICA+XG4gICAgICAgIHt0aWNrVmFsdWV9XG4gICAgICA8L3RleHQ+XG4gICAgPC9nPlxuICApKTtcbiIsImV4cG9ydCBjb25zdCBNYXJrcyA9ICh7XG4gIGRhdGEsXG4gIHhTY2FsZSxcbiAgeFZhbHVlLFxuICB5U2NhbGUsXG4gIHlWYWx1ZSxcbiAgY29sb3JTY2FsZSxcbiAgY29sb3JWYWx1ZSxcbiAgdG9vbHRpcEZvcm1hdCxcbiAgY2lyY2xlUmFkaXVzXG59KSA9PlxuICBkYXRhLm1hcChkID0+IChcbiAgICA8Y2lyY2xlXG4gICAgICBjbGFzc05hbWU9XCJtYXJrXCJcbiAgICAgIGN4PXt4U2NhbGUoeFZhbHVlKGQpKX1cbiAgICAgIGN5PXt5U2NhbGUoeVZhbHVlKGQpKX1cbiAgICAgIGZpbGw9e2NvbG9yU2NhbGUoY29sb3JWYWx1ZShkKSl9XG4gICAgICByPXtjaXJjbGVSYWRpdXN9XG4gICAgPlxuICAgICAgPHRpdGxlPnt0b29sdGlwRm9ybWF0KHhWYWx1ZShkKSl9PC90aXRsZT5cbiAgICA8L2NpcmNsZT5cbiAgKSk7XG4iLCJleHBvcnQgY29uc3QgQ29sb3JMZWdlbmQgPSAoe1xuICBjb2xvclNjYWxlLFxuICB0aWNrU3BhY2luZyA9IDIwLFxuICB0aWNrU2l6ZSA9IDEwLFxuICB0aWNrVGV4dE9mZnNldCA9IDIwLFxuICBvbkhvdmVyLFxuICBob3ZlcmVkVmFsdWUsXG4gIGZhZGVPcGFjaXR5XG59KSA9PlxuICBjb2xvclNjYWxlLmRvbWFpbigpLm1hcCgoZG9tYWluVmFsdWUsIGkpID0+IChcbiAgICA8Z1xuICAgICAgY2xhc3NOYW1lPVwidGlja1wiXG4gICAgICB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoMCwke2kgKiB0aWNrU3BhY2luZ30pYH1cbiAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4ge1xuICAgICAgICBvbkhvdmVyKGRvbWFpblZhbHVlKTtcbiAgICAgIH19XG4gICAgICBvbk1vdXNlT3V0PXsoKSA9PiB7XG4gICAgICAgIG9uSG92ZXIobnVsbCk7XG4gICAgICB9fVxuICAgICAgb3BhY2l0eT17aG92ZXJlZFZhbHVlICYmIGRvbWFpblZhbHVlICE9PSBob3ZlcmVkVmFsdWUgPyBmYWRlT3BhY2l0eSA6IDF9XG4gICAgPlxuICAgICAgPGNpcmNsZSBmaWxsPXtjb2xvclNjYWxlKGRvbWFpblZhbHVlKX0gcj17dGlja1NpemV9IC8+XG4gICAgICA8dGV4dCB4PXt0aWNrVGV4dE9mZnNldH0gZHk9XCIuMzJlbVwiPlxuICAgICAgICB7ZG9tYWluVmFsdWV9XG4gICAgICA8L3RleHQ+XG4gICAgPC9nPlxuICApKTtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHsgY3N2LCBzY2FsZUxpbmVhciwgc2NhbGVPcmRpbmFsLCBtYXgsIGZvcm1hdCwgZXh0ZW50IH0gZnJvbSAnZDMnO1xuaW1wb3J0IHsgdXNlRGF0YSB9IGZyb20gJy4vdXNlRGF0YSc7XG5pbXBvcnQgeyBBeGlzQm90dG9tIH0gZnJvbSAnLi9BeGlzQm90dG9tJztcbmltcG9ydCB7IEF4aXNMZWZ0IH0gZnJvbSAnLi9BeGlzTGVmdCc7XG5pbXBvcnQgeyBNYXJrcyB9IGZyb20gJy4vTWFya3MnO1xuaW1wb3J0IHsgQ29sb3JMZWdlbmQgfSBmcm9tICcuL0NvbG9yTGVnZW5kJztcblxuY29uc3Qgd2lkdGggPSA5NjA7XG5jb25zdCBoZWlnaHQgPSA1MDA7XG5jb25zdCBtYXJnaW4gPSB7IHRvcDogMjAsIHJpZ2h0OiAyMDAsIGJvdHRvbTogNjUsIGxlZnQ6IDkwIH07XG5jb25zdCB4QXhpc0xhYmVsT2Zmc2V0ID0gNTA7XG5jb25zdCB5QXhpc0xhYmVsT2Zmc2V0ID0gNDU7XG5jb25zdCBmYWRlT3BhY2l0eSA9IDAuMjtcblxuY29uc3QgQXBwID0gKCkgPT4ge1xuICBjb25zdCBkYXRhID0gdXNlRGF0YSgpO1xuICBjb25zdCBbaG92ZXJlZFZhbHVlLCBzZXRIb3ZlcmVkVmFsdWVdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgaWYgKCFkYXRhKSB7XG4gICAgcmV0dXJuIDxwcmU+TG9hZGluZy4uLjwvcHJlPjtcbiAgfVxuXG4gIGNvbnN0IGlubmVySGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG4gIGNvbnN0IGlubmVyV2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xuXG4gIGNvbnN0IHhWYWx1ZSA9IGQgPT4gZC5iaWxsX2xlbmd0aF9tbTtcbiAgY29uc3QgeEF4aXNMYWJlbCA9ICdCaWwgTGVuZ3RoJztcblxuICBjb25zdCB5VmFsdWUgPSBkID0+IGQuYmlsbF9kZXB0aF9tbTtcbiAgY29uc3QgeUF4aXNMYWJlbCA9ICdCaWxsIERlcHRoJztcblxuICBjb25zdCBjb2xvclZhbHVlID0gZCA9PiBkLnNwZWNpZXM7XG4gIGNvbnN0IGNvbG9yTGVnZW5kTGFiZWwgPSAnU3BlY2llcyc7XG5cbiAgY29uc3QgZmlsdGVyZWREYXRhID0gZGF0YS5maWx0ZXIoZCA9PiBob3ZlcmVkVmFsdWUgPT09IGNvbG9yVmFsdWUoZCkpO1xuXG4gIGNvbnN0IGNpcmNsZVJhZGl1cyA9IDc7XG5cbiAgY29uc3Qgc2lGb3JtYXQgPSBmb3JtYXQoJy4ycycpO1xuICBjb25zdCB4QXhpc1RpY2tGb3JtYXQgPSB0aWNrVmFsdWUgPT4gc2lGb3JtYXQodGlja1ZhbHVlKS5yZXBsYWNlKCdHJywgJ0InKTtcblxuICBjb25zdCB4U2NhbGUgPSBzY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihleHRlbnQoZGF0YSwgeFZhbHVlKSlcbiAgICAucmFuZ2UoWzAsIGlubmVyV2lkdGhdKVxuICAgIC5uaWNlKCk7XG5cbiAgY29uc3QgeVNjYWxlID0gc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oZXh0ZW50KGRhdGEsIHlWYWx1ZSkpXG4gICAgLnJhbmdlKFswLCBpbm5lckhlaWdodF0pO1xuXG4gIGNvbnN0IGNvbG9yU2NhbGUgPSBzY2FsZU9yZGluYWwoKVxuICAgIC5kb21haW4oZGF0YS5tYXAoY29sb3JWYWx1ZSkpXG4gICAgLnJhbmdlKFsnI0U2ODQyQScsICcjMTM3QjgwJywgJyM4RTZDOEEnXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9PlxuICAgICAgPGcgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7bWFyZ2luLmxlZnR9LCR7bWFyZ2luLnRvcH0pYH0+XG4gICAgICAgIDxBeGlzQm90dG9tXG4gICAgICAgICAgeFNjYWxlPXt4U2NhbGV9XG4gICAgICAgICAgaW5uZXJIZWlnaHQ9e2lubmVySGVpZ2h0fVxuICAgICAgICAgIHRpY2tGb3JtYXQ9e3hBeGlzVGlja0Zvcm1hdH1cbiAgICAgICAgICB0aWNrT2Zmc2V0PXs1fVxuICAgICAgICAvPlxuICAgICAgICA8dGV4dFxuICAgICAgICAgIGNsYXNzTmFtZT1cImF4aXMtbGFiZWxcIlxuICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgkey15QXhpc0xhYmVsT2Zmc2V0fSwke2lubmVySGVpZ2h0IC9cbiAgICAgICAgICAgIDJ9KSByb3RhdGUoLTkwKWB9XG4gICAgICAgID5cbiAgICAgICAgICB7eUF4aXNMYWJlbH1cbiAgICAgICAgPC90ZXh0PlxuICAgICAgICA8QXhpc0xlZnQgeVNjYWxlPXt5U2NhbGV9IGlubmVyV2lkdGg9e2lubmVyV2lkdGh9IHRpY2tPZmZzZXQ9ezV9IC8+XG4gICAgICAgIDx0ZXh0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYXhpcy1sYWJlbFwiXG4gICAgICAgICAgeD17aW5uZXJXaWR0aCAvIDJ9XG4gICAgICAgICAgeT17aW5uZXJIZWlnaHQgKyB4QXhpc0xhYmVsT2Zmc2V0fVxuICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICA+XG4gICAgICAgICAge3hBeGlzTGFiZWx9XG4gICAgICAgIDwvdGV4dD5cbiAgICAgICAgPGcgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7aW5uZXJXaWR0aCArIDYwfSwgNjApYH0+XG4gICAgICAgICAgPHRleHQgeD17MzV9IHk9ey0yNX0gY2xhc3NOYW1lPVwiYXhpcy1sYWJlbFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIj5cbiAgICAgICAgICAgIHtjb2xvckxlZ2VuZExhYmVsfVxuICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICA8Q29sb3JMZWdlbmRcbiAgICAgICAgICAgIHRpY2tTcGFjaW5nPXsyMn1cbiAgICAgICAgICAgIHRpY2tTaXplPXsxMH1cbiAgICAgICAgICAgIHRpY2tUZXh0T2Zmc2V0PXsxMn1cbiAgICAgICAgICAgIHRpY2tTaXplPXtjaXJjbGVSYWRpdXN9XG4gICAgICAgICAgICBjb2xvclNjYWxlPXtjb2xvclNjYWxlfVxuICAgICAgICAgICAgb25Ib3Zlcj17c2V0SG92ZXJlZFZhbHVlfVxuICAgICAgICAgICAgaG92ZXJlZFZhbHVlPXtob3ZlcmVkVmFsdWV9XG4gICAgICAgICAgICBmYWRlT3BhY2l0eT17ZmFkZU9wYWNpdHl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9nPlxuICAgICAgICA8ZyBvcGFjaXR5PXtob3ZlcmVkVmFsdWUgPyBmYWRlT3BhY2l0eSA6IDF9PlxuICAgICAgICAgIDxNYXJrc1xuICAgICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICAgIHhTY2FsZT17eFNjYWxlfVxuICAgICAgICAgICAgeFZhbHVlPXt4VmFsdWV9XG4gICAgICAgICAgICB5U2NhbGU9e3lTY2FsZX1cbiAgICAgICAgICAgIHlWYWx1ZT17eVZhbHVlfVxuICAgICAgICAgICAgY29sb3JTY2FsZT17Y29sb3JTY2FsZX1cbiAgICAgICAgICAgIGNvbG9yVmFsdWU9e2NvbG9yVmFsdWV9XG4gICAgICAgICAgICB0b29sdGlwRm9ybWF0PXt4QXhpc1RpY2tGb3JtYXR9XG4gICAgICAgICAgICBjaXJjbGVSYWRpdXM9e2NpcmNsZVJhZGl1c31cbiAgICAgICAgICAvPlxuICAgICAgICA8L2c+XG4gICAgICAgIDxNYXJrc1xuICAgICAgICAgIGRhdGE9e2ZpbHRlcmVkRGF0YX1cbiAgICAgICAgICB4U2NhbGU9e3hTY2FsZX1cbiAgICAgICAgICB4VmFsdWU9e3hWYWx1ZX1cbiAgICAgICAgICB5U2NhbGU9e3lTY2FsZX1cbiAgICAgICAgICB5VmFsdWU9e3lWYWx1ZX1cbiAgICAgICAgICBjb2xvclNjYWxlPXtjb2xvclNjYWxlfVxuICAgICAgICAgIGNvbG9yVmFsdWU9e2NvbG9yVmFsdWV9XG4gICAgICAgICAgdG9vbHRpcEZvcm1hdD17eEF4aXNUaWNrRm9ybWF0fVxuICAgICAgICAgIGNpcmNsZVJhZGl1cz17Y2lyY2xlUmFkaXVzfVxuICAgICAgICAvPlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICApO1xufTtcbmNvbnN0IHJvb3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcblJlYWN0RE9NLnJlbmRlcig8QXBwIC8+LCByb290RWxlbWVudCk7XG4iXSwibmFtZXMiOlsidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJjc3YiLCJSZWFjdCIsImZvcm1hdCIsInNjYWxlTGluZWFyIiwiZXh0ZW50Iiwic2NhbGVPcmRpbmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7RUFHQSxNQUFNLE1BQU07RUFDWixFQUFFLGtGQUFrRixDQUFDO0VBQ3JGO0VBQ08sTUFBTSxPQUFPLEdBQUcsTUFBTTtFQUM3QixFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUdBLGdCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekM7RUFDQSxFQUFFQyxpQkFBUyxDQUFDLE1BQU07RUFDbEIsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUk7RUFDckI7RUFDQSxNQUFNLENBQUMsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO0VBQzNDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7RUFDekMsTUFBTSxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUM7RUFDakQsTUFBTSxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFD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