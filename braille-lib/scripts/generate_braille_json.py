# generate_braille_json.py
import yaml
import json
import os
import glob
import sys

def dots_to_unicode(dots_list):
    """dots: ['1','12','1246'] → Unicode Braille (U+2800 + bitmask)
    Each element can be a multi-digit string like '1246' meaning dots 1,2,4,6.
    """
    bitmask = 0
    dot_map = {'1': 1, '2': 2, '3': 4, '4': 8, '5': 16, '6': 32}
    for d in dots_list:
        d = str(d).strip()
        if '-' in d:
            # Handle "1-2" format
            for dd in d.split('-'):
                bitmask |= dot_map.get(dd.strip(), 0)
        else:
            # Handle multi-digit strings like "1246" → dots 1, 2, 4, 6
            for ch in d:
                bitmask |= dot_map.get(ch, 0)
    return chr(0x2800 + bitmask)

def process_file(input_path, output_path):
    """Process a single YAML file and write JSON output."""
    with open(input_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    if data is None:
        print(f"  Skipping {input_path} (empty file)")
        return

    if 'entries' not in data:
        print(f"  Skipping {input_path} (no 'entries' key)")
        return

    processed_entries = []
    for entry in data['entries']:
        if 'dots' in entry:
            # For multi-cell characters, generate unicode for each cell
            dots = entry['dots']
            braille_cells = []
            for d in dots:
                cell_bitmask = 0
                for ch in str(d):
                    cell_bitmask |= {'1': 1, '2': 2, '3': 4, '4': 8, '5': 16, '6': 32}.get(ch, 0)
                braille_cells.append(chr(0x2800 + cell_bitmask))

            braille_str = ''.join(braille_cells)
            # Only set braille if not already present
            if 'braille' not in entry:
                entry['braille'] = braille_str
            entry['unicode'] = ' '.join(f"U+{ord(c):04X}" for c in braille_str)
        processed_entries.append(entry)

    output = {
        'schema_version': data.get('schema_version', '1.0'),
        'system_id': data.get('system_id', ''),
        'system_name': data.get('system_name', ''),
        'locale': data.get('locale', ''),
        'braille_type': data.get('braille_type', ''),
        'cell_size': data.get('cell_size', 6),
        'entries': processed_entries,
        'settings': data.get('settings', {})
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"  ✓ {os.path.basename(input_path)} → {os.path.basename(output_path)} ({len(processed_entries)} entries)")

def main():
    # Determine source and output directories
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(script_dir)  # braille-lib/
    source_dir = os.path.join(base_dir, 'data', 'source')
    output_dir = os.path.join(base_dir, 'data', 'output')

    # Find all YAML files
    yaml_files = glob.glob(os.path.join(source_dir, '**', '*.yaml'), recursive=True)

    if not yaml_files:
        print(f"No YAML files found in {source_dir}")
        sys.exit(1)

    print(f"Found {len(yaml_files)} YAML files in {source_dir}\n")

    for yaml_path in sorted(yaml_files):
        # Preserve subdirectory structure: source/kana/basic.yaml → output/kana/basic.json
        rel_path = os.path.relpath(yaml_path, source_dir)
        json_path = os.path.join(output_dir, os.path.splitext(rel_path)[0] + '.json')

        try:
            process_file(yaml_path, json_path)
        except Exception as e:
            print(f"  ✗ Error processing {rel_path}: {e}")

    print(f"\nJSON generation complete!")

if __name__ == '__main__':
    main()