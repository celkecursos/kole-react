import type { ReactNode } from 'react';
import {
  AppWindow,
  ArrowDown,
  ArrowDownWideNarrow,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  ArrowUpNarrowWide,
  Bell,
  Briefcase,
  Building2,
  Calculator,
  Calendar,
  Camera,
  ChartColumn,
  ChartLine,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Circle,
  CircleAlert,
  CircleCheck,
  CirclePlus,
  CircleQuestionMark,
  CircleUser,
  CircleX,
  Clock,
  CloudUpload,
  Code,
  Copy,
  CreditCard,
  Download,
  Ellipsis,
  EllipsisVertical,
  Equal,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FilePen,
  FileSpreadsheet,
  FileText,
  FileType,
  Folder,
  Funnel,
  FunnelX,
  GripVertical,
  Heart,
  History,
  House,
  IdCard,
  Image,
  Inbox,
  Info,
  Key,
  Layers,
  LayoutGrid,
  Link,
  List,
  LoaderCircle,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Map,
  MapPin,
  Maximize,
  Menu,
  Minimize,
  MessageSquare,
  Minus,
  Moon,
  Package,
  Palette,
  PanelRight,
  Paperclip,
  Pause,
  Pencil,
  Phone,
  Play,
  Plus,
  Printer,
  RefreshCw,
  RotateCw,
  Save,
  Search,
  Send,
  Settings,
  Square,
  SquareMousePointer,
  Shield,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Sun,
  Table,
  Tag,
  Tags,
  Trash2,
  TriangleAlert,
  Truck,
  Upload,
  User,
  UserPen,
  UserPlus,
  Users,
  Video,
  Volume2,
  Wallet,
  X,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from 'lucide-react';
import { cx } from './cx';

/**
 * Ícones registrados, pelo nome do Lucide (https://lucide.dev/icons).
 * Só estes entram no pacote; o app registra outros com `registrarIcones`
 * ou passa o componente direto: `icone={<Rocket />}`.
 */
const ICONES: Record<string, LucideIcon> = {
  'app-window': AppWindow,
  'arrow-down': ArrowDown,
  'arrow-down-wide-narrow': ArrowDownWideNarrow,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-up-down': ArrowUpDown,
  'arrow-up-narrow-wide': ArrowUpNarrowWide,
  bell: Bell,
  briefcase: Briefcase,
  'building-2': Building2,
  calculator: Calculator,
  calendar: Calendar,
  camera: Camera,
  'chart-column': ChartColumn,
  'chart-line': ChartLine,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevrons-left': ChevronsLeft,
  'chevrons-right': ChevronsRight,
  circle: Circle,
  'circle-alert': CircleAlert,
  'circle-check': CircleCheck,
  'circle-plus': CirclePlus,
  'circle-question-mark': CircleQuestionMark,
  'circle-user': CircleUser,
  'circle-x': CircleX,
  clock: Clock,
  'cloud-upload': CloudUpload,
  code: Code,
  copy: Copy,
  'credit-card': CreditCard,
  download: Download,
  ellipsis: Ellipsis,
  'ellipsis-vertical': EllipsisVertical,
  equal: Equal,
  'external-link': ExternalLink,
  eye: Eye,
  'eye-off': EyeOff,
  file: File,
  'file-pen': FilePen,
  'file-spreadsheet': FileSpreadsheet,
  'file-text': FileText,
  'file-type': FileType,
  folder: Folder,
  funnel: Funnel,
  'funnel-x': FunnelX,
  'grip-vertical': GripVertical,
  heart: Heart,
  history: History,
  house: House,
  'id-card': IdCard,
  image: Image,
  inbox: Inbox,
  info: Info,
  key: Key,
  layers: Layers,
  'layout-grid': LayoutGrid,
  link: Link,
  list: List,
  'loader-circle': LoaderCircle,
  lock: Lock,
  'log-in': LogIn,
  'log-out': LogOut,
  mail: Mail,
  map: Map,
  'map-pin': MapPin,
  maximize: Maximize,
  menu: Menu,
  minimize: Minimize,
  'message-square': MessageSquare,
  minus: Minus,
  moon: Moon,
  package: Package,
  palette: Palette,
  'panel-right': PanelRight,
  paperclip: Paperclip,
  pause: Pause,
  pencil: Pencil,
  phone: Phone,
  play: Play,
  plus: Plus,
  printer: Printer,
  'refresh-cw': RefreshCw,
  'rotate-cw': RotateCw,
  save: Save,
  search: Search,
  send: Send,
  settings: Settings,
  square: Square,
  'square-mouse-pointer': SquareMousePointer,
  shield: Shield,
  'shield-check': ShieldCheck,
  'shopping-cart': ShoppingCart,
  'sliders-horizontal': SlidersHorizontal,
  star: Star,
  sun: Sun,
  table: Table,
  tag: Tag,
  tags: Tags,
  'trash-2': Trash2,
  'triangle-alert': TriangleAlert,
  truck: Truck,
  upload: Upload,
  user: User,
  'user-pen': UserPen,
  'user-plus': UserPlus,
  users: Users,
  video: Video,
  'volume-2': Volume2,
  wallet: Wallet,
  x: X,
  'zoom-in': ZoomIn,
  'zoom-out': ZoomOut,
};

/** Nome de ícone registrado (ou qualquer outro, depois de `registrarIcones`). */
export type NomeIcone = keyof typeof ICONES | (string & {});

/** Ícone aceito pelos componentes: nome do Lucide (`'save'`) ou um nó React (`<Rocket />`). */
export type IconeProp = NomeIcone | ReactNode;

/** Acrescenta ícones ao registro: `registrarIcones({ rocket: Rocket })`. */
export function registrarIcones(icones: Record<string, LucideIcon>) {
  Object.assign(ICONES, icones);
}

// o bundler do APP substitui `process.env.NODE_ENV` (padrão das bibliotecas);
// sem bundler, `process` não existe e os avisos ficam desligados
declare const process: { env: { NODE_ENV?: string } };
let DEV = false;
try {
  DEV = process.env.NODE_ENV !== 'production';
} catch {
  DEV = false;
}

const avisados = new Set<string>();
function avisar(msg: string) {
  if (avisados.has(msg) || !DEV) return;
  avisados.add(msg);
  console.warn(`[@celke/kole-react] ${msg}`);
}

export interface IconeProps {
  icone?: IconeProp;
  className?: string;
  /** Gira continuamente (indicador de carregamento). */
  girar?: boolean;
}

export function Icone({ icone, className, girar }: IconeProps) {
  if (icone === undefined || icone === null || icone === false || icone === '') return null;
  if (typeof icone === 'string') {
    const nome = icone.trim();
    const C = ICONES[nome];
    if (!C) {
      avisar(`Ícone "${nome}" não registrado. Use registrarIcones({ '${nome}': Componente }) ou passe o componente do lucide-react.`);
      return null;
    }
    return <C className={cx('lp-ic', girar && 'lp-ic--girar', className)} size="1em" strokeWidth={2} aria-hidden="true" focusable="false" />;
  }
  return (
    <span className={cx('lp-icone', girar && 'lp-ic--girar', className)} aria-hidden="true">
      {icone}
    </span>
  );
}
