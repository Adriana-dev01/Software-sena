<template>
  <div class="noticia-editor" :class="{ 'editor-focused': isFocused }">

    <!-- ═══════════════════ BARRA DE HERRAMIENTAS ═══════════════════ -->
    <div v-if="editor" class="editor-toolbar">

      <!-- Fila 1 -->
      <div class="toolbar-row">

        <!-- Historial -->
        <div class="toolbar-group">
          <v-tooltip text="Deshacer (Ctrl+Z)" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :disabled="!editor.can().undo()" @click="editor.chain().focus().undo().run()">
                <v-icon size="17">mdi-undo</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Rehacer (Ctrl+Y)" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :disabled="!editor.can().redo()" @click="editor.chain().focus().redo().run()">
                <v-icon size="17">mdi-redo</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Limpiar formato" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" @click="editor.chain().focus().clearNodes().unsetAllMarks().run()">
                <v-icon size="17">mdi-format-clear</v-icon>
              </button>
            </template>
          </v-tooltip>
        </div>

        <div class="tb-divider" />

        <!-- Párrafo / Headings -->
        <div class="toolbar-group">
          <v-menu>
            <template #activator="{ props }">
              <button v-bind="props" class="tb-btn tb-select">
                <span class="tb-select-text">{{ currentBlockLabel }}</span>
                <v-icon size="14">mdi-chevron-down</v-icon>
              </button>
            </template>
            <v-list density="compact" min-width="160">
              <v-list-item title="Párrafo"       @click="editor.chain().focus().setParagraph().run()" />
              <v-list-item title="Título 1"      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" />
              <v-list-item title="Título 2"      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" />
              <v-list-item title="Título 3"      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" />
              <v-list-item title="Título 4"      @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" />
              <v-list-item title="Bloque código" @click="editor.chain().focus().toggleCodeBlock().run()" />
              <v-list-item title="Cita"          @click="editor.chain().focus().toggleBlockquote().run()" />
            </v-list>
          </v-menu>
        </div>

        <div class="tb-divider" />

        <!-- Texto básico -->
        <div class="toolbar-group">
          <v-tooltip text="Negrita (Ctrl+B)" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
                <v-icon size="17">mdi-format-bold</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Cursiva (Ctrl+I)" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
                <v-icon size="17">mdi-format-italic</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Subrayado (Ctrl+U)" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive('underline') }" @click="editor.chain().focus().toggleUnderline().run()">
                <v-icon size="17">mdi-format-underline</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Tachado" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()">
                <v-icon size="17">mdi-format-strikethrough</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Código inline" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive('code') }" @click="editor.chain().focus().toggleCode().run()">
                <v-icon size="17">mdi-code-tags</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Superíndice" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive('superscript') }" @click="editor.chain().focus().toggleSuperscript().run()">
                <v-icon size="17">mdi-format-superscript</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Subíndice" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive('subscript') }" @click="editor.chain().focus().toggleSubscript().run()">
                <v-icon size="17">mdi-format-subscript</v-icon>
              </button>
            </template>
          </v-tooltip>
        </div>

        <div class="tb-divider" />

        <!-- Colores -->
        <div class="toolbar-group">
          <v-tooltip text="Color de texto" location="bottom">
            <template #activator="{ props }">
              <label v-bind="props" class="tb-btn tb-color-btn">
                <v-icon size="17">mdi-format-color-text</v-icon>
                <span class="color-bar" :style="{ background: textColor }" />
                <input type="color" :value="textColor" class="color-input"
                  @input="e => applyTextColor((e.target as HTMLInputElement).value)" />
              </label>
            </template>
          </v-tooltip>
          <v-tooltip text="Color de fondo" location="bottom">
            <template #activator="{ props }">
              <label v-bind="props" class="tb-btn tb-color-btn">
                <v-icon size="17">mdi-format-color-highlight</v-icon>
                <span class="color-bar" :style="{ background: highlightColor }" />
                <input type="color" :value="highlightColor" class="color-input"
                  @input="e => applyHighlight((e.target as HTMLInputElement).value)" />
              </label>
            </template>
          </v-tooltip>
          <v-tooltip text="Quitar color" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" @click="editor.chain().focus().unsetColor().unsetHighlight().run()">
                <v-icon size="17">mdi-format-color-reset</v-icon>
              </button>
            </template>
          </v-tooltip>
        </div>
      </div>

      <!-- Fila 2 -->
      <div class="toolbar-row">

        <!-- Alineación -->
        <div class="toolbar-group">
          <v-tooltip text="Izquierda" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive({ textAlign: 'left' }) }" @click="editor.chain().focus().setTextAlign('left').run()">
                <v-icon size="17">mdi-format-align-left</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Centrar" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive({ textAlign: 'center' }) }" @click="editor.chain().focus().setTextAlign('center').run()">
                <v-icon size="17">mdi-format-align-center</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Derecha" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive({ textAlign: 'right' }) }" @click="editor.chain().focus().setTextAlign('right').run()">
                <v-icon size="17">mdi-format-align-right</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Justificar" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive({ textAlign: 'justify' }) }" @click="editor.chain().focus().setTextAlign('justify').run()">
                <v-icon size="17">mdi-format-align-justify</v-icon>
              </button>
            </template>
          </v-tooltip>
        </div>

        <div class="tb-divider" />

        <!-- Listas -->
        <div class="toolbar-group">
          <v-tooltip text="Lista con viñetas" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">
                <v-icon size="17">mdi-format-list-bulleted</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Lista numerada" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()">
                <v-icon size="17">mdi-format-list-numbered</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Reducir sangría" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" @click="editor.chain().focus().liftListItem('listItem').run()">
                <v-icon size="17">mdi-format-indent-decrease</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Aumentar sangría" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" @click="editor.chain().focus().sinkListItem('listItem').run()">
                <v-icon size="17">mdi-format-indent-increase</v-icon>
              </button>
            </template>
          </v-tooltip>
        </div>

        <div class="tb-divider" />

        <!-- Insertar -->
        <div class="toolbar-group">

          <!-- Enlace -->
          <v-tooltip text="Insertar enlace" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: editor.isActive('link') }" @click="openLinkDialog">
                <v-icon size="17">mdi-link-variant</v-icon>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip text="Quitar enlace" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :disabled="!editor.isActive('link')" @click="editor.chain().focus().unsetLink().run()">
                <v-icon size="17">mdi-link-variant-off</v-icon>
              </button>
            </template>
          </v-tooltip>

          <!-- Imagen inline ★ -->
          <v-tooltip text="Insertar imagen" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" @click="imageDialog = true">
                <v-icon size="17">mdi-image-plus</v-icon>
              </button>
            </template>
          </v-tooltip>

          <!-- Tabla -->
          <v-tooltip text="Insertar tabla" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" @click="tableDialog = true">
                <v-icon size="17">mdi-table-plus</v-icon>
              </button>
            </template>
          </v-tooltip>

          <!-- Línea horizontal -->
          <v-tooltip text="Línea horizontal" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" @click="editor.chain().focus().setHorizontalRule().run()">
                <v-icon size="17">mdi-minus</v-icon>
              </button>
            </template>
          </v-tooltip>
        </div>

        <!-- Opciones de tabla activa -->
        <template v-if="editor.isActive('table')">
          <div class="tb-divider" />
          <div class="toolbar-group">
            <v-tooltip text="Añadir fila arriba" location="bottom">
              <template #activator="{ props }">
                <button v-bind="props" type="button" class="tb-btn" @click="editor.chain().focus().addRowBefore().run()"><v-icon size="15">mdi-table-row-plus-before</v-icon></button>
              </template>
            </v-tooltip>
            <v-tooltip text="Añadir fila abajo" location="bottom">
              <template #activator="{ props }">
                <button v-bind="props" type="button" class="tb-btn" @click="editor.chain().focus().addRowAfter().run()"><v-icon size="15">mdi-table-row-plus-after</v-icon></button>
              </template>
            </v-tooltip>
            <v-tooltip text="Eliminar fila" location="bottom">
              <template #activator="{ props }">
                <button v-bind="props" type="button" class="tb-btn" @click="editor.chain().focus().deleteRow().run()"><v-icon size="15">mdi-table-row-remove</v-icon></button>
              </template>
            </v-tooltip>
            <v-tooltip text="Añadir columna derecha" location="bottom">
              <template #activator="{ props }">
                <button v-bind="props" type="button" class="tb-btn" @click="editor.chain().focus().addColumnAfter().run()"><v-icon size="15">mdi-table-column-plus-after</v-icon></button>
              </template>
            </v-tooltip>
            <v-tooltip text="Eliminar columna" location="bottom">
              <template #activator="{ props }">
                <button v-bind="props" type="button" class="tb-btn" @click="editor.chain().focus().deleteColumn().run()"><v-icon size="15">mdi-table-column-remove</v-icon></button>
              </template>
            </v-tooltip>
            <v-tooltip text="Eliminar tabla" location="bottom">
              <template #activator="{ props }">
                <button v-bind="props" type="button" class="tb-btn" @click="editor.chain().focus().deleteTable().run()"><v-icon size="15" color="error">mdi-table-remove</v-icon></button>
              </template>
            </v-tooltip>
          </div>
        </template>

        <v-spacer />

        <!-- Vista HTML -->
        <div class="toolbar-group">
          <v-tooltip :text="sourceMode ? 'Vista visual' : 'Ver código HTML'" location="bottom">
            <template #activator="{ props }">
              <button v-bind="props" type="button" class="tb-btn" :class="{ active: sourceMode }" @click="toggleSource">
                <v-icon size="17">mdi-code-tags</v-icon>
                <span class="tb-label ml-1">HTML</span>
              </button>
            </template>
          </v-tooltip>
        </div>
      </div>
    </div>

    <!-- ═══════════════════ ÁREA DE EDICIÓN ═══════════════════ -->

    <!-- Vista visual (Tiptap) -->
    <div v-show="!sourceMode">
      <editor-content
        :editor="editor"
        class="editor-content"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>

    <!-- Vista código HTML -->
    <div v-show="sourceMode" class="source-view">
      <textarea
        v-model="sourceHtml"
        class="source-textarea"
        spellcheck="false"
        @blur="applySourceHtml"
      />
    </div>

    <!-- Footer: contador de palabras -->
    <div class="editor-footer">
      <span>{{ wordCount }} palabras · {{ charCount }} caracteres</span>
    </div>

    <!-- ═══════════════════ DIALOG: INSERTAR IMAGEN ═══════════════════ -->
    <v-dialog v-model="imageDialog" max-width="520" persistent>
      <v-card rounded="xl">
        <v-card-title class="pt-5 px-6 font-weight-bold d-flex align-center gap-2">
          <v-icon color="primary">mdi-image-plus</v-icon>
          Insertar imagen
        </v-card-title>

        <v-card-text class="px-6 pb-2">
          <v-tabs v-model="imageTab" color="primary" class="mb-4">
            <v-tab value="url">
              <v-icon start size="16">mdi-link</v-icon>
              Desde URL
            </v-tab>
            <v-tab value="upload">
              <v-icon start size="16">mdi-upload</v-icon>
              Subir archivo
            </v-tab>
          </v-tabs>

          <v-window v-model="imageTab">
            <!-- Tab URL -->
            <v-window-item value="url">
              <v-text-field
                v-model="imageUrl"
                label="URL de la imagen"
                variant="outlined"
                density="comfortable"
                placeholder="https://ejemplo.com/imagen.jpg"
                prepend-inner-icon="mdi-link"
                clearable
                class="mb-3"
              />
              <!-- Preview URL -->
              <v-img
                v-if="imageUrl"
                :src="imageUrl"
                max-height="180"
                rounded="lg"
                cover
                class="mb-2"
              />
              <v-row dense>
                <v-col>
                  <v-text-field v-model="imageAlt" label="Texto alternativo (alt)" variant="outlined" density="compact" />
                </v-col>
                <v-col cols="5">
                  <v-select v-model="imageAlign" label="Alineación" :items="alignOptions" variant="outlined" density="compact" />
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Tab Upload -->
            <v-window-item value="upload">
              <div
                class="upload-zone"
                :class="{ 'drag-over': isDragging }"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
              >
                <template v-if="!uploadPreview">
                  <v-icon size="40" color="grey-lighten-1">mdi-cloud-upload-outline</v-icon>
                  <p class="text-body-2 text-medium-emphasis mt-2 mb-0">
                    Arrastra una imagen aquí o <span class="text-primary font-weight-medium">haz clic para seleccionar</span>
                  </p>
                  <p class="text-caption text-medium-emphasis">PNG, JPG, GIF, WEBP — máx. 5 MB</p>
                </template>
                <template v-else>
                  <v-img :src="uploadPreview" max-height="180" rounded="lg" cover />
                  <v-btn size="x-small" variant="text" color="error" class="mt-2" @click.stop="clearUpload">
                    <v-icon start>mdi-close</v-icon> Quitar
                  </v-btn>
                </template>
              </div>
              <input ref="fileInputRef" type="file" accept="image/*" class="d-none" @change="handleFileChange" />
              <v-row dense class="mt-3">
                <v-col>
                  <v-text-field v-model="imageAlt" label="Texto alternativo (alt)" variant="outlined" density="compact" />
                </v-col>
                <v-col cols="5">
                  <v-select v-model="imageAlign" label="Alineación" :items="alignOptions" variant="outlined" density="compact" />
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card-text>

        <v-card-actions class="px-6 pb-4 gap-2">
          <v-spacer />
          <v-btn variant="text" @click="closeImageDialog">Cancelar</v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            :disabled="!canInsertImage"
            prepend-icon="mdi-check"
            @click="insertImage"
          >
            Insertar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ═══════════════════ DIALOG: INSERTAR TABLA ═══════════════════ -->
    <v-dialog v-model="tableDialog" max-width="360" persistent>
      <v-card rounded="xl">
        <v-card-title class="pt-5 px-6 font-weight-bold d-flex align-center gap-2">
          <v-icon color="primary">mdi-table-plus</v-icon>
          Insertar tabla
        </v-card-title>
        <v-card-text class="px-6 pb-2">
          <v-row dense>
            <v-col cols="6">
              <v-text-field v-model.number="tableRows" label="Filas" type="number" min="1" max="20" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model.number="tableCols" label="Columnas" type="number" min="1" max="10" variant="outlined" density="comfortable" />
            </v-col>
          </v-row>
          <v-checkbox v-model="tableHeader" label="Primera fila como encabezado" density="compact" hide-details />
        </v-card-text>
        <v-card-actions class="px-6 pb-4 gap-2">
          <v-spacer />
          <v-btn variant="text" @click="tableDialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="tonal" prepend-icon="mdi-check" @click="insertTable">Insertar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ═══════════════════ DIALOG: ENLACE ═══════════════════ -->
    <v-dialog v-model="linkDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-title class="pt-5 px-6 font-weight-bold d-flex align-center gap-2">
          <v-icon color="primary">mdi-link-variant</v-icon>
          Insertar enlace
        </v-card-title>
        <v-card-text class="px-6 pb-2">
          <v-text-field
            v-model="linkUrl"
            label="URL del enlace"
            variant="outlined"
            density="comfortable"
            placeholder="https://ejemplo.com"
            prepend-inner-icon="mdi-link"
            class="mb-2"
          />
          <v-checkbox v-model="linkNewTab" label="Abrir en nueva pestaña" density="compact" hide-details />
        </v-card-text>
        <v-card-actions class="px-6 pb-4 gap-2">
          <v-spacer />
          <v-btn variant="text" @click="linkDialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="tonal" prepend-icon="mdi-check" @click="insertLink">Insertar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'

// ── Props & Emits ─────────────────────────────────────────────
const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [html: string]
  'update:text': [text: string]
}>()

// ── Editor ────────────────────────────────────────────────────
const isFocused = ref(false)

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit,
    Underline,
    Subscript,
    Superscript,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Link.configure({ openOnClick: false }),
    Placeholder.configure({
      placeholder: props.placeholder || 'Escribe el contenido de la noticia aquí...',
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Image.configure({ inline: false, allowBase64: true }),
    Table.configure({ resizable: true }),
    TableRow,
    TableCell,
    TableHeader,
  ],
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
    emit('update:text', editor.getText())
  },
})

// Computed para label del bloque activo
const currentBlockLabel = computed(() => {
  if (!editor.value) return 'Párrafo'
  if (editor.value.isActive('heading', { level: 1 })) return 'Título 1'
  if (editor.value.isActive('heading', { level: 2 })) return 'Título 2'
  if (editor.value.isActive('heading', { level: 3 })) return 'Título 3'
  if (editor.value.isActive('heading', { level: 4 })) return 'Título 4'
  if (editor.value.isActive('codeBlock'))  return 'Código'
  if (editor.value.isActive('blockquote')) return 'Cita'
  return 'Párrafo'
})

const charCount = computed(() => editor.value?.getText().length || 0)
const wordCount = computed(() => {
  const text = editor.value?.getText() || ''
  return text.trim() ? text.trim().split(/\s+/).length : 0
})

// ── Colores ───────────────────────────────────────────────────
const textColor = ref('#000000')
const highlightColor = ref('#FFFF00')

function applyTextColor(color: string) {
  textColor.value = color
  editor.value?.chain().focus().setColor(color).run()
}

function applyHighlight(color: string) {
  highlightColor.value = color
  editor.value?.chain().focus().setHighlight({ color }).run()
}

// ── Vista fuente HTML ─────────────────────────────────────────
const sourceMode = ref(false)
const sourceHtml = ref('')

function toggleSource() {
  if (!sourceMode.value) {
    sourceHtml.value = editor.value?.getHTML() || ''
  } else {
    applySourceHtml()
  }
  sourceMode.value = !sourceMode.value
}

function applySourceHtml() {
  editor.value?.commands.setContent(sourceHtml.value, false)
  emit('update:modelValue', sourceHtml.value)
}

// ── Dialog Imagen ─────────────────────────────────────────────
const imageDialog = ref(false)
const imageTab = ref<'url' | 'upload'>('url')
const imageUrl = ref('')
const imageAlt = ref('')
const imageAlign = ref('none')
const uploadPreview = ref('')
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement>()

const alignOptions = [
  { title: 'Ninguna',  value: 'none' },
  { title: 'Izquierda', value: 'left' },
  { title: 'Centro',    value: 'center' },
  { title: 'Derecha',   value: 'right' },
]

const canInsertImage = computed(() => {
  if (imageTab.value === 'url') return !!imageUrl.value.trim()
  return !!uploadPreview.value
})

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) readImageFile(file)
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) readImageFile(file)
}

function readImageFile(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    alert('La imagen no debe superar 5 MB')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function clearUpload() {
  uploadPreview.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function insertImage() {
  const src = imageTab.value === 'url' ? imageUrl.value.trim() : uploadPreview.value
  if (!src) return

  const attrs: Record<string, string> = { src }
  if (imageAlt.value) attrs.alt = imageAlt.value
  if (imageAlign.value !== 'none') attrs.style = `float: ${imageAlign.value}; margin: 8px`

  editor.value?.chain().focus().setImage(attrs).run()
  closeImageDialog()
}

function closeImageDialog() {
  imageDialog.value = false
  imageUrl.value = ''
  imageAlt.value = ''
  imageAlign.value = 'none'
  uploadPreview.value = ''
  isDragging.value = false
  if (fileInputRef.value) fileInputRef.value.value = ''
}

// ── Dialog Tabla ──────────────────────────────────────────────
const tableDialog = ref(false)
const tableRows = ref(3)
const tableCols = ref(3)
const tableHeader = ref(true)

function insertTable() {
  editor.value?.chain().focus().insertTable({
    rows: tableRows.value,
    cols: tableCols.value,
    withHeaderRow: tableHeader.value,
  }).run()
  tableDialog.value = false
}

// ── Dialog Enlace ─────────────────────────────────────────────
const linkDialog = ref(false)
const linkUrl = ref('')
const linkNewTab = ref(true)

function openLinkDialog() {
  const prev = editor.value?.getAttributes('link').href || ''
  linkUrl.value = prev
  linkDialog.value = true
}

function insertLink() {
  if (!linkUrl.value.trim()) return
  editor.value?.chain().focus().setLink({
    href: linkUrl.value.trim(),
    target: linkNewTab.value ? '_blank' : '_self',
  }).run()
  linkDialog.value = false
  linkUrl.value = ''
}

// ── Sincronización con padre ──────────────────────────────────
watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && val !== undefined && val !== editor.value.getHTML()) {
      editor.value.commands.setContent(val || '', false)
    }
  }
)

onBeforeUnmount(() => editor.value?.destroy())
</script>

<style scoped>
/* ── Contenedor ── */
.noticia-editor {
  border: 1px solid rgba(0, 0, 0, 0.23);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.noticia-editor.editor-focused {
  border-color: #1976D2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
}

/* ── Toolbar ── */
.editor-toolbar {
  background: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 4px 6px;
}
.toolbar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  min-height: 34px;
}
.toolbar-group {
  display: flex;
  align-items: center;
  gap: 1px;
}
.tb-divider {
  width: 1px;
  height: 22px;
  background: rgba(0,0,0,0.15);
  margin: 0 4px;
}

/* ── Botones ── */
.tb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 5px;
  border: none;
  background: transparent;
  border-radius: 5px;
  cursor: pointer;
  color: #444;
  transition: background 0.15s, color 0.15s;
}
.tb-btn:hover:not(:disabled) {
  background: rgba(0,0,0,0.08);
  color: #1976D2;
}
.tb-btn.active {
  background: rgba(25, 118, 210, 0.12);
  color: #1976D2;
}
.tb-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.tb-label {
  font-size: 12px;
  font-weight: 600;
}

/* ── Select de bloque ── */
.tb-select {
  gap: 4px;
  padding: 0 8px;
  min-width: 90px;
  font-size: 13px;
}
.tb-select-text {
  font-size: 13px;
  font-weight: 500;
}

/* ── Color buttons ── */
.tb-color-btn {
  flex-direction: column;
  gap: 1px;
  cursor: pointer;
  position: relative;
}
.color-bar {
  display: block;
  width: 17px;
  height: 3px;
  border-radius: 2px;
}
.color-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ── Área de edición ── */
.editor-content :deep(.ProseMirror) {
  min-height: 300px;
  max-height: 600px;
  overflow-y: auto;
  padding: 16px 20px;
  outline: none;
  font-size: 15px;
  line-height: 1.75;
  color: #222;
}
.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
}

/* ── Estilos del contenido ── */
.editor-content :deep(.ProseMirror h1) { font-size: 1.9rem; font-weight: 700; margin: 14px 0 8px; }
.editor-content :deep(.ProseMirror h2) { font-size: 1.5rem; font-weight: 600; margin: 12px 0 6px; }
.editor-content :deep(.ProseMirror h3) { font-size: 1.2rem; font-weight: 600; margin: 10px 0 5px; }
.editor-content :deep(.ProseMirror h4) { font-size: 1.05rem; font-weight: 600; margin: 8px 0 4px; }
.editor-content :deep(.ProseMirror ul) { padding-left: 24px; list-style: disc; }
.editor-content :deep(.ProseMirror ol) { padding-left: 24px; list-style: decimal; }
.editor-content :deep(.ProseMirror li) { margin-bottom: 3px; }
.editor-content :deep(.ProseMirror blockquote) {
  border-left: 4px solid #1976D2;
  padding: 6px 14px;
  color: #555;
  font-style: italic;
  background: #f0f4ff;
  border-radius: 0 6px 6px 0;
  margin: 10px 0;
}
.editor-content :deep(.ProseMirror code) {
  background: #f0f0f0;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}
.editor-content :deep(.ProseMirror pre) {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 14px 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.88em;
  line-height: 1.6;
}
.editor-content :deep(.ProseMirror pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}
.editor-content :deep(.ProseMirror a) {
  color: #1976D2;
  text-decoration: underline;
}
.editor-content :deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 8px 0;
  cursor: pointer;
}
.editor-content :deep(.ProseMirror img.ProseMirror-selectednode) {
  outline: 3px solid #1976D2;
}
.editor-content :deep(.ProseMirror hr) {
  border: none;
  border-top: 2px solid #e0e0e0;
  margin: 16px 0;
}

/* ── Tabla ── */
.editor-content :deep(.ProseMirror table) {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
  font-size: 14px;
}
.editor-content :deep(.ProseMirror td),
.editor-content :deep(.ProseMirror th) {
  border: 1px solid #ccc;
  padding: 8px 12px;
  vertical-align: top;
  min-width: 60px;
}
.editor-content :deep(.ProseMirror th) {
  background: #f5f5f5;
  font-weight: 600;
}
.editor-content :deep(.ProseMirror .selectedCell) {
  background: #e8f0fe;
}

/* ── Vista HTML fuente ── */
.source-view {
  padding: 8px;
  background: #1e1e1e;
}
.source-textarea {
  width: 100%;
  min-height: 300px;
  max-height: 600px;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Cascadia Code', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  padding: 12px;
  border: none;
  outline: none;
  resize: vertical;
  box-sizing: border-box;
}

/* ── Footer ── */
.editor-footer {
  background: #f8f9fa;
  border-top: 1px solid rgba(0,0,0,0.08);
  padding: 4px 12px;
  font-size: 11px;
  color: #888;
  text-align: right;
}

/* ── Upload zone ── */
.upload-zone {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  min-height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.upload-zone:hover,
.upload-zone.drag-over {
  border-color: #1976D2;
  background: #e8f0fe;
}
</style>
