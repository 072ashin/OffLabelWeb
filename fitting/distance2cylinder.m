function [F, J] = distance2cylinder(x, P)
% Calculate modified signed distance of each point in each row of P to the cylinder
% parameterized by x = (rho phi zeta alpha k)
% Input:
%     x : tuple of 5 real numbers (rho phi zeta alpha k) describing the cylinder
%     P : n queries of 3-D points of size n * 3
% Output:
%     F is of size n * 1 are the modified signed distances corresponding to each point in P
%     J is of size n * 5 are the Jacobian of F with respect to x
    rho = x(1); phi = x(2); zeta = x(3); alpha = x(4); k = x(5);
    n = [cos(phi) * sin(zeta), sin(phi) * sin(zeta), cos(zeta)];
    if (abs(zeta) < 1e-12)
        n_phi = [0, sign(cos(phi)), 0];
    else
        n_phi = [-sin(phi) * sin(zeta), cos(phi) * sin(zeta), 0];
    end
    n_zeta = [cos(phi) * cos(zeta), sin(phi) * cos(zeta), -sin(zeta)];
    % n_phi_bar = n_phi / sin(zeta);
    n_phi_bar = cross(n_zeta, n);
    n_phi_bar = n_phi_bar / sqrt(sum(n_phi_bar .^ 2, 2));
    if (dot(n_phi_bar, n_phi, 2) < 0)
        n_phi_bar = -n_phi_bar;
    end
    n_zeta_phi = [-sin(phi) * cos(zeta), cos(phi) * cos(zeta), 0];
    n_phi_phi_bar = [-cos(phi), sin(phi), 0];
    a = n_zeta * cos(alpha) + n_phi_bar * sin(alpha);
    F = k/2 * sum((cross(P - rho * repmat(n, size(P, 1), 1), repmat(a, size(P, 1), 1), 2)) .^ 2, 2) - (P - rho * repmat(n, size(P, 1), 1)) * n';
    J = zeros(size(P, 1), 5);
    J(:, 1) = k * (repmat(rho, size(P, 1), 1) - P * n') + ones(size(P, 1), 1);
    J(:, 2) = -k * (rho * P * n_phi' + (P * a') .* (P * (n_zeta_phi * cos(alpha) + n_phi_phi_bar * sin(alpha))')) - P * n_phi';
    J(:, 3) = k * ((P * a') .* (P * n') * cos(alpha) - rho * P * n_zeta') - P * n_zeta';
    J(:, 4) = k * (P * a') .* (P * (n_zeta * sin(alpha) - n_phi_bar * cos(alpha))');
    J(:, 5) = 1/2 * (sum(P .^ 2, 2) - 2 * rho * P * n' - (P * a') .^ 2 + repmat(rho * rho, size(P, 1), 1));
end
