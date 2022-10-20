import { FieldNode, SelectionSetNode } from "graphql";

interface ParsedFieldsDictionary {
  [key: string]: true | ParsedFieldsDictionary;
}

export function parseFieldList(
  node: FieldNode
): ParsedFieldsDictionary {
  if (node.selectionSet === undefined) return {};
  return parseSelectionSet(node.selectionSet);
}

function parseSelectionSet(
  set: SelectionSetNode
): ParsedFieldsDictionary {
  const parsedFields: ParsedFieldsDictionary = {};

  for (const selection of set.selections as FieldNode[]) {
    if (selection.selectionSet === undefined) {
      parsedFields[selection.name.value] = true;
    } else {
      parsedFields[selection.name.value] =
        parseSelectionSet(selection.selectionSet);
    }
  }

  return parsedFields;
}

export function parseRelations(
  fields: ParsedFieldsDictionary
): string[] {
  const relations: string[] = [];

  for (const field in fields) {
    if (typeof fields[field] === "object") {
      relations.push(
        field,
        ...parseRelations(
          fields[field] as ParsedFieldsDictionary
        ).map((subrelation) => `${field}.${subrelation}`)
      );
    }
  }

  return relations;
}
