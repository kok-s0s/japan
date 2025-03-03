import csv
import os


def remove_duplicates(csv_file):
    unique_rows = set()
    output_lines = []

    # 读取 CSV 文件并去重
    with open(csv_file, mode="r", encoding="utf-8") as file:
        reader = csv.reader(file)
        header = next(reader)  # 读取表头
        output_lines.append(header)

        for row in reader:
            row_tuple = tuple(row)
            if row_tuple not in unique_rows:
                unique_rows.add(row_tuple)
                output_lines.append(row)

    # 写入去重后的数据，覆盖原文件
    with open(csv_file, mode="w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        writer.writerows(output_lines)


def check_file_path_and_remove_duplicates(vocab_csv_filename):
    if os.path.exists(vocab_csv_filename):
        remove_duplicates(vocab_csv_filename)
        print(f"去重完成，文件 {vocab_csv_filename} 已更新。")
    else:
        print("文件不存在，请检查文件路径。")


if __name__ == "__main__":
    vocab_csv_filename = "database/words/vocab.csv"
    check_file_path_and_remove_duplicates(vocab_csv_filename)
    grammar_csv_filename = "database/grammar/N1_grammar_practice.csv"
    check_file_path_and_remove_duplicates(grammar_csv_filename)
