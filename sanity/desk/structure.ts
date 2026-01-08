import { StructureBuilder } from 'sanity/structure'

/**
 * Custom desk structure for ebook authoring
 *
 * Groups content into logical sections:
 * - Chapters: Main content documents
 * - Pages: Individual pages within chapters
 * - Visual Blocks: Reusable visual components
 */
export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Chapters - main document type for ebook content
      S.listItem()
        .title('Chapters')
        .schemaType('chapter')
        .child(
          S.documentTypeList('chapter')
            .title('Chapters')
        ),

      S.divider(),

      // Pages - for standalone pages (using chapter schema for now)
      S.listItem()
        .title('Pages')
        .schemaType('chapter')
        .child(
          S.documentTypeList('chapter')
            .title('Pages')
            .filter('_type == "chapter"')
        ),

      S.divider(),

      // Visual Blocks - grouped reference for custom block types
      S.listItem()
        .title('Visual Blocks')
        .child(
          S.list()
            .title('Visual Block Types')
            .items([
              S.listItem()
                .title('Sketches')
                .child(
                  S.documentList()
                    .title('Sketches')
                    .filter('_type == "chapter" && defined(content[_type == "sketch"])')
                ),
              S.listItem()
                .title('Big Quotes')
                .child(
                  S.documentList()
                    .title('Documents with Big Quotes')
                    .filter('_type == "chapter" && defined(content[_type == "bigQuote"])')
                ),
              S.listItem()
                .title('Pain Points')
                .child(
                  S.documentList()
                    .title('Documents with Pain Points')
                    .filter('_type == "chapter" && defined(content[_type == "painPoints"])')
                ),
              S.listItem()
                .title('Margin Notes')
                .child(
                  S.documentList()
                    .title('Documents with Margin Notes')
                    .filter('_type == "chapter" && defined(content[_type == "marginNote"])')
                ),
            ])
        ),
    ])
