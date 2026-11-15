---
"@zoobzio/browser": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
---

The browser's folders use the files' columns and take part in the selection. In `@zoobzio/browser` a folder carries `values`, what it shows under each column (`BrowserFolder<T>`, generic over the file with a default, as `FolderAction<T>` now is). Its label renders in the first column. Folders select beside files: their keys are a second set of the container, `selectedFolders`, as a folder's key and a file's may be the same, with `toggleFolder` and `isFolderSelected` on the service and `selectionCount` over both sets. `toggleAll`, `isAllSelected`, `isIndeterminate`, `hasSelection`, and `clearSelection` cover both, and a bulk handler is handed the folder keys after the file keys. A fetch that settles now keeps only the selected keys it still lists, so a bulk action no longer reaches a row a search or a refresh took out of view. The service no longer re-sorts the folders by label: they render in the order the fetch returns them, as the files do, so a fetch can sort them by the column it is handed.

The vue `browser-folders.vue` renders a cell per column in place of one cell across them: the label in the first column, the folder's `values` in the others, formatted as a file's are and empty where it carries none, overridden through `folderCell:<key>`, `folderCell:<type>`, and `folderCell`. Where the service is selectable a folder row has a checkbox (the `rowCheckbox` part of `pt.folders`) and `f-data-browser-selected`, and the bulk actions bar counts folders and files.

The nuxt wrapper formats a folder's typed values through the prosary service as it does a file's and draws the folder checkbox as the layer's `Checkbox`; `createBrowser` takes `selectedFolders` in `initial`.

Breaking: a fetch that relied on the service to put its folders in alphabetical order must now return them in it, and `sortFolders` is gone from the package's utilities. Folders are selectable wherever a bulk action is declared, so a bulk handler that reads its first argument alone acts on the files of a selection that may also hold folders: read the second. The `folder` slot fills the first column's cell rather than one spanning every column, and a folder row's selection cell is no longer empty. A selection seeded through `initial` is narrowed to the first listing.
