import random
import csv

# Input ingredients

selectedIngredient = ['potatoes', 'bananas', 'strawberries']

proposedIngredient = ['chicken', 'pork', 'salt', 'milk',
                      'pepper', 'pizza', 'beans', 'chocolate',
                      'steak', 'cream', 'sugar', 'tea',
                      'coffee', 'egg', 'beer', 'rib']

allIngredient = selectedIngredient + proposedIngredient


class Edge:
    def __init__(self, start, end, frequency):
        self.start = start
        self.end = end
        self.frequency = frequency
        if self.start in selectedIngredient:
            self.isStart = 1
        else:
            self.isStart = 0
        if self.end in selectedIngredient:
            self.isEnd = 1
        else:
            self.isEnd = 0


def createEdge(ingredients):
    edges = []
    # Generate random frequency
    for i in range(len(allIngredient)):
        j = i + 1
        while True:
            if j >= len(allIngredient):
                break
            frequency = random.randint(1, 4000)
            edge = Edge(allIngredient[i],
                        allIngredient[j], frequency=frequency)
            edges.append(edge)
            j += 1

    return edges


def writeCSV(edges, path="testData/ingredients.csv"):
    file = open(path, 'w', encoding='utf-8')
    file.write(
        'source,target,is_source_selected,is_target_selected,frequency' + '\n')

    for edge in edges:
        file.write(
            f'{edge.start},{edge.end},{edge.isStart},{edge.isEnd},{edge.frequency}\n')
    file.close()


def main():
    edges = createEdge(allIngredient)
    writeCSV(edges)


if __name__ == '__main__':
    main()
