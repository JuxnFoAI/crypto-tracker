import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const STAR_PATH =
  'M11.48 3.5a.562.562 0 0 1 1.04 0l2.125 5.11a.563.563 0 0 0 .475.345l5.518.442c.5.04.7.663.32.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .32-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z';

@Component({
  selector: 'app-star-icon',
  standalone: true,
  template: `
    <svg
      [attr.fill]="filled() ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="1.5"
      viewBox="0 0 24 24"
      [class]="sizeClass()"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="path" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarIconComponent {
  readonly filled = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  protected readonly path = STAR_PATH;

  protected readonly sizeClass = computed((): string => {
    switch (this.size()) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-5 w-5';
    }
  });
}
