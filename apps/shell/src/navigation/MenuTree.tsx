import type { MenuNode } from "@mf-demo/contracts";
import { NavLink } from "react-router-dom";

import styles from "./MenuTree.module.css";

export function MenuTree({ nodes }: { nodes: MenuNode[] }) {
  if (nodes.length === 0) {
    return <p className={styles.empty}>No provider menu entries loaded.</p>;
  }
  return (
    <ul className={styles.list}>
      {nodes.map((node) => (
        <MenuNodeView key={node.id} node={node} />
      ))}
    </ul>
  );
}

function MenuNodeView({ node }: { node: MenuNode }) {
  if (node.type === "route") {
    return (
      <li className={styles.item}>
        <NavLink
          to={node.path}
          className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ""}`}
        >
          {node.label}
        </NavLink>
      </li>
    );
  }

  return (
    <li className={styles.group}>
      <details open className={styles.details}>
        <summary className={styles.summary}>{node.label}</summary>
        <ul className={styles.nested}>
          {node.children.map((child) => (
            <MenuNodeView key={child.id} node={child} />
          ))}
        </ul>
      </details>
    </li>
  );
}

