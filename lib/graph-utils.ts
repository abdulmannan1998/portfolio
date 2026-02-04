import { type Node, type Edge } from "@xyflow/react";
import { RESUME_DATA } from "@/data/resume-data";

export const getInitialNodes = (): Node[] => {
  const nodes: Node[] = [];

  // Center: Root
  nodes.push({
    id: "Mannan",
    type: "custom",
    position: { x: 0, y: 0 },
    data: { label: "Mannan Abdul", type: "root" },
  });

  // Level 1: Companies & Education (Radial around center)
  const l1Nodes = RESUME_DATA.graph.nodes.filter(
    (n) => n.type === "company" || n.type === "education",
  );

  l1Nodes.forEach((node, i) => {
    const angle = (i / l1Nodes.length) * 2 * Math.PI - Math.PI / 2;
    const radius = 300;
    nodes.push({
      id: node.id,
      type: "custom",
      position: {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      },
      data: { label: node.label, type: node.type },
    });
  });

  // Level 2: Tech (Clustered under companies roughly)
  const techNodes = RESUME_DATA.graph.nodes.filter((n) => n.type === "tech");

  techNodes.forEach((node, i) => {
    // Find who connects to this tech
    const sourceId = RESUME_DATA.graph.edges.find(
      (e) => e.target === node.id,
    )?.source;
    const sourceNode = nodes.find((n) => n.id === sourceId);

    if (sourceNode) {
      // Place relative to source
      const offsetAngle = (i % 3) * (Math.PI / 3) + Math.PI / 2; // Fan out downwards
      const offsetR = 200;
      nodes.push({
        id: node.id,
        type: "custom",
        position: {
          x:
            sourceNode.position.x +
            Math.cos(offsetAngle) * offsetR +
            (Math.random() * 50 - 25),
          y:
            sourceNode.position.y +
            Math.sin(offsetAngle) * offsetR +
            Math.random() * 50,
        },
        data: { label: node.label, type: node.type },
      });
    } else {
      // Fallback
      nodes.push({
        id: node.id,
        type: "custom",
        position: { x: (i - 5) * 150, y: 500 },
        data: { label: node.label, type: node.type },
      });
    }
  });

  return nodes;
};

export const getInitialEdges = (): Edge[] => {
  return RESUME_DATA.graph.edges.map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: "default",
    animated: true,
    style: { stroke: "#44403c" },
  }));
};
