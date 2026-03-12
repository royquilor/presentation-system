figma.showUI(__html__, { width: 480, height: 640 });

type TextMapping = {
  layerName: string;
  value: string;
};

figma.ui.onmessage = async (msg: {
  type: string;
  mappings?: TextMapping[];
}) => {
  if (msg.type === "scan-selection") {
    const selection = figma.currentPage.selection;

    if (selection.length === 0) {
      figma.ui.postMessage({ type: "scan-result", error: "No frame selected. Select a frame first." });
      return;
    }

    const frame = selection[0];
    if (frame.type !== "FRAME" && frame.type !== "COMPONENT" && frame.type !== "INSTANCE") {
      figma.ui.postMessage({ type: "scan-result", error: "Selection must be a Frame, Component, or Instance." });
      return;
    }

    const textLayers: { name: string; characters: string }[] = [];
    findTextNodes(frame, textLayers);

    figma.ui.postMessage({
      type: "scan-result",
      frameName: frame.name,
      textLayers,
    });
  }

  if (msg.type === "apply-content") {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify("No frame selected");
      return;
    }

    const original = selection[0];
    if (original.type !== "FRAME" && original.type !== "COMPONENT" && original.type !== "INSTANCE") {
      figma.notify("Selection must be a Frame, Component, or Instance");
      return;
    }

    const clone = original.clone();
    clone.x = original.x + original.width + 100;
    clone.name = `${original.name} — Content Applied`;

    const mappings = msg.mappings ?? [];
    let replaced = 0;

    for (const mapping of mappings) {
      const matched = findTextNodesByName(clone, mapping.layerName);
      for (const node of matched) {
        await figma.loadFontAsync(node.fontName as FontName);
        node.characters = mapping.value;
        replaced++;
      }
    }

    figma.currentPage.selection = [clone];
    figma.viewport.scrollAndZoomIntoView([clone]);
    figma.notify(`Done — replaced ${replaced} text layer${replaced !== 1 ? "s" : ""}`);
    figma.ui.postMessage({ type: "apply-result", replaced });
  }
};

function findTextNodes(
  node: SceneNode,
  result: { name: string; characters: string }[]
) {
  if (node.type === "TEXT") {
    result.push({ name: node.name, characters: node.characters });
  }
  if ("children" in node) {
    for (const child of node.children) {
      findTextNodes(child, result);
    }
  }
}

function findTextNodesByName(node: SceneNode, name: string): TextNode[] {
  const results: TextNode[] = [];
  if (node.type === "TEXT" && node.name === name) {
    results.push(node);
  }
  if ("children" in node) {
    for (const child of node.children) {
      results.push(...findTextNodesByName(child, name));
    }
  }
  return results;
}
