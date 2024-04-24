// Importing the Component decorator from the Angular core module
import { Component } from '@angular/core';
// Decorating the ErrorComponent class with metadata
@Component({
  selector: 'app-error', // Selector used to identify this component in HTML templates
  standalone: true, // Custom property (standalone) for internal purposes or custom usage
  imports: [], // An empty array of imports (typically used for importing Angular modules or other components/services)
  templateUrl: './error.component.html', // Path to the HTML template file associated with this component
  styleUrl: './error.component.css' // Path to the CSS file associated with this component
})
export class ErrorComponent { // Defining the ErrorComponent class

}